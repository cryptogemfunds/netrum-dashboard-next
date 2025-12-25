'use client'

export default function Footer() {
  return (
    <footer className="text-xs text-gray-400 text-center py-6 space-y-1">
      {/* Nội dung cũ – GIỮ NGUYÊN */}
      <div>
        © {new Date().getFullYear()} Netrum Labs — Node Dashboard
      </div>

      {/* Nội dung mới – thêm vào */}
      <div>
        Made by{" "}
        <span className="font-semibold text-gray-200">
          NodeSafe
        </span>{" "}
        · X{" "}
        <a
          href="https://x.com/cryptogemfunds"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-400 hover:underline"
        >
          @cryptogemfunds
        </a>
      </div>
    </footer>
  )
}
