export function blobToUint8Array(blob) {
  return new Promise((resolve, reject) => {
    // Create a new FileReader instance
    const reader = new FileReader()

    // Listen for the load event
    reader.addEventListener('load', () => {
      // Get the result as a ArrayBuffer
      const buffer = reader.result

      // Convert the ArrayBuffer to a Uint8Array
      const uint8Array = new Uint8Array(buffer as ArrayBuffer)

      // Resolve the promise with the Uint8Array
      resolve(uint8Array)
    })

    // Listen for the error event
    reader.addEventListener('error', () => {
      // Reject the promise with the error
      reject(reader.error)
    })

    // Read the Blob as an ArrayBuffer
    reader.readAsArrayBuffer(blob)
  })
}
