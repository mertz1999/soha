// Cuts the product out of a photo with Apple's Vision framework (macOS 14 or later) and writes a
// transparent PNG cropped to the product. Used for the Shopier proposal: the product pixels in every
// studio scene come from the seller's one phone photo, so the product cannot change.
//
//   swift tools/proposals/cutout.swift <in.jpg|png|webp> <out.png>
//
// Vision may find several subjects (a pair of earrings is two). The script keeps every subject at least
// 8% the size of the largest one and drops smaller clutter, then cleans the soft edges so no halo of the
// old background shows on a new one.
import CoreImage
import Foundation
import ImageIO
import Vision

let args = CommandLine.arguments
guard args.count == 3 else {
  FileHandle.standardError.write("usage: swift cutout.swift <in> <out.png>\n".data(using: .utf8)!)
  exit(2)
}
let inURL = URL(fileURLWithPath: args[1])
let outURL = URL(fileURLWithPath: args[2])

guard let src = CGImageSourceCreateWithURL(inURL as CFURL, nil),
  let image = CGImageSourceCreateImageAtIndex(src, 0, nil)
else {
  FileHandle.standardError.write("could not read \(args[1])\n".data(using: .utf8)!)
  exit(1)
}

let request = VNGenerateForegroundInstanceMaskRequest()
let handler = VNImageRequestHandler(cgImage: image, options: [:])
do { try handler.perform([request]) } catch {
  FileHandle.standardError.write("Vision failed: \(error)\n".data(using: .utf8)!)
  exit(1)
}
guard let result = request.results?.first, !result.allInstances.isEmpty else {
  FileHandle.standardError.write("no subject found in \(args[1])\n".data(using: .utf8)!)
  exit(1)
}

// Area of each subject, from the label map (0 = background, 1…n = subjects).
let labels = result.instanceMask
CVPixelBufferLockBaseAddress(labels, .readOnly)
let lw = CVPixelBufferGetWidth(labels), lh = CVPixelBufferGetHeight(labels)
let stride = CVPixelBufferGetBytesPerRow(labels)
let base = CVPixelBufferGetBaseAddress(labels)!.assumingMemoryBound(to: UInt8.self)
var area = [Int: Int]()
for y in 0..<lh { for x in 0..<lw { let v = Int(base[y * stride + x]); if v > 0 { area[v, default: 0] += 1 } } }
CVPixelBufferUnlockBaseAddress(labels, .readOnly)
let largest = area.values.max() ?? 0
let keep = IndexSet(area.filter { Double($0.value) >= Double(largest) * 0.08 }.keys)

do {
  let masked = try result.generateMaskedImage(ofInstances: keep, from: handler, croppedToInstancesExtent: true)
  let ci = CIImage(cvPixelBuffer: masked)
  let ctx = CIContext()
  let sRGB = CGColorSpace(name: CGColorSpace.sRGB)!
  let w = Int(ci.extent.width), h = Int(ci.extent.height)
  var px = [UInt8](repeating: 0, count: w * h * 4) // premultiplied RGBA
  ctx.render(ci, toBitmap: &px, rowBytes: w * 4, bounds: ci.extent, format: .RGBA8, colorSpace: sRGB)

  // Clean the edges. Soft edge pixels still carry some of the old background's colour, which shows as a
  // light or dark halo on a new background. Each edge pixel takes the colour of the nearest solid product
  // pixel (within 4 px) and keeps its own alpha; faint edge alpha is trimmed a little.
  let src = px
  let r = 4
  for y in 0..<h {
    for x in 0..<w {
      let i = (y * w + x) * 4
      let a = Int(src[i + 3])
      if a == 0 || a >= 250 { continue }
      var best = Int.max, bi = -1
      for dy in -r...r {
        let yy = y + dy
        if yy < 0 || yy >= h { continue }
        for dx in -r...r {
          let xx = x + dx
          if xx < 0 || xx >= w { continue }
          let j = (yy * w + xx) * 4
          if src[j + 3] >= 250 { let d = dx * dx + dy * dy; if d < best { best = d; bi = j } }
        }
      }
      let na = max(0, min(255, (a - 20) * 255 / 235))
      px[i + 3] = UInt8(na)
      if bi < 0 {
        // No solid pixel nearby: keep the colour, rescaled to the trimmed alpha.
        for c in 0..<3 { px[i + c] = UInt8(a > 0 ? Int(src[i + c]) * na / a : 0) }
      } else {
        let ba = Int(src[bi + 3])
        for c in 0..<3 { px[i + c] = UInt8(min(255, Int(src[bi + c]) * 255 / ba * na / 255)) }
      }
    }
  }

  let provider = CGDataProvider(data: Data(px) as CFData)!
  let out = CGImage(width: w, height: h, bitsPerComponent: 8, bitsPerPixel: 32, bytesPerRow: w * 4, space: sRGB,
    bitmapInfo: CGBitmapInfo(rawValue: CGImageAlphaInfo.premultipliedLast.rawValue), provider: provider, decode: nil,
    shouldInterpolate: false, intent: .defaultIntent)!
  guard let dest = CGImageDestinationCreateWithURL(outURL as CFURL, "public.png" as CFString, 1, nil) else { throw CocoaError(.fileWriteUnknown) }
  CGImageDestinationAddImage(dest, out, nil)
  guard CGImageDestinationFinalize(dest) else { throw CocoaError(.fileWriteUnknown) }
  print("subjects found: \(area.count), kept: \(keep.count), cut-out: \(w)×\(h) from \(image.width)×\(image.height)")
} catch {
  FileHandle.standardError.write("could not write \(args[2]): \(error)\n".data(using: .utf8)!)
  exit(1)
}
