export function PhoneMockup() {
  return (
    <div role="img" aria-label="Contoh tampilan halaman pembayaran Bayaraja di ponsel" className="relative w-full max-w-[300px] rounded-[2.5rem] border-2 border-gray-300 bg-gray-800 shadow-2xl overflow-hidden">
      <div className="flex justify-center pt-3 pb-1">
        <div className="h-1.5 w-20 rounded-full bg-gray-600" />
      </div>
      <div className="bg-gray-50 mx-2 mb-2 rounded-2xl overflow-hidden">
        <div className="bg-white border-b border-gray-100 py-2.5 text-center">
          <span className="text-xs font-bold text-slate-800">Bayaraja</span>
        </div>
        <div className="p-3 space-y-2.5">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[9px] font-bold text-white">1</div>
              <span className="text-[11px] font-semibold text-slate-700">Scan & Bayar</span>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-slate-800">Toko Kopi Nusantara</p>
              <p className="text-[10px] text-slate-400 mb-2">BCA &middot; Anindita</p>
              <div className="inline-flex items-center rounded-full bg-orange-50 px-3 py-1 mb-3">
                <span className="text-sm font-bold text-orange-500">Rp 75.000</span>
              </div>
              <div className="mx-auto w-28 h-28 rounded-lg border border-gray-100 p-1.5 bg-white">
                <svg viewBox="0 0 21 21" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <rect x="1" y="1" width="7" height="7" rx="1" fill="none" stroke="#1e293b" strokeWidth="1"/>
                  <rect x="2.5" y="2.5" width="4" height="4" rx="0.5" fill="#1e293b"/>
                  <rect x="13" y="1" width="7" height="7" rx="1" fill="none" stroke="#1e293b" strokeWidth="1"/>
                  <rect x="14.5" y="2.5" width="4" height="4" rx="0.5" fill="#1e293b"/>
                  <rect x="1" y="13" width="7" height="7" rx="1" fill="none" stroke="#1e293b" strokeWidth="1"/>
                  <rect x="2.5" y="14.5" width="4" height="4" rx="0.5" fill="#1e293b"/>
                  {[
                    [9,1],[10,1],[11,1],[9,3],[11,3],[9,5],[10,5],
                    [1,9],[3,9],[5,9],[1,11],[5,11],[1,10],
                    [9,9],[10,9],[11,9],[9,11],[11,11],[10,10],
                    [13,9],[15,9],[17,9],[19,9],[13,11],[15,11],[17,11],
                    [9,13],[11,13],[13,13],[9,15],[13,15],[9,17],[11,17],
                    [15,13],[17,13],[19,13],[15,15],[17,15],[19,15],[15,17],[19,17],
                  ].map(([cx, cy], i) => (
                    <rect key={i} x={cx} y={cy} width="1" height="1" fill="#1e293b"/>
                  ))}
                </svg>
              </div>
              <p className="text-[9px] text-slate-400 mt-2">GoPay, OVO, Dana, semua mobile banking bisa</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[9px] font-bold text-white">2</div>
              <span className="text-[11px] font-semibold text-slate-700">Kirim Bukti Bayar</span>
            </div>
            <div className="border-2 border-dashed border-gray-200 rounded-lg py-4 flex flex-col items-center gap-1.5 bg-gray-50">
              <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
                <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <p className="text-[9px] text-slate-500 font-medium">Foto bukti transfer</p>
              <p className="text-[8px] text-slate-400">JPG atau PNG, maks. 5MB</p>
            </div>
            <div className="mt-2 h-6 w-full rounded-lg bg-orange-500 flex items-center justify-center">
              <span className="text-[9px] font-semibold text-white">Kirim Bukti Pembayaran</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
