// @ts-nocheck
const { useState } = window.React;
const { SearchIcon, LoaderIcon } = window;

window.PDFSearchViewer = ({ file, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  
  // Mock search logic
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    setResults([]);

    // Simulate search delay and finding results
    setTimeout(() => {
      // Mock results based on search term length to simulate variation
      const mockResults = [];
      const count = Math.max(1, Math.floor(Math.random() * 5)); 
      
      for(let i=0; i<count; i++) {
        mockResults.push({
            page: Math.floor(Math.random() * 10) + 1,
            snippet: `...${searchTerm} নামীয় ভোটার তালিকাভুক্ত...`,
            location: Math.random() * 500
        });
      }
      setResults(mockResults);
      setIsSearching(false);
    }, 1000);
  };

  const handleResultClick = (result) => {
    // In a real implementation with pdf.js, this would scroll the canvas/div
    alert(`পিডিএফ এর পৃষ্ঠা ${result.page} এ যাওয়া হচ্ছে...`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col animate-fade-in">
        {/* Viewer Header */}
        <div className="h-16 bg-gray-900 text-white flex items-center justify-between px-4 shadow-md shrink-0">
            <div className="flex items-center overflow-hidden">
                <button onClick={onClose} className="mr-4 text-gray-400 hover:text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                </button>
                <div className="truncate">
                    <h3 className="font-medium text-sm sm:text-base truncate">{file.name}</h3>
                </div>
            </div>
            
            <form onSubmit={handleSearch} className="flex items-center ml-2">
                <input 
                    type="text" 
                    placeholder="নাম বা NID খুঁজুন..." 
                    className="bg-gray-800 text-white border-none rounded-l px-3 py-1.5 focus:ring-1 focus:ring-emerald-500 outline-none text-sm w-32 sm:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-r text-white">
                    <SearchIcon className="w-5 h-5" />
                </button>
            </form>
        </div>

        {/* Viewer Body */}
        <div className="flex-1 flex overflow-hidden bg-gray-100">
            {/* Sidebar Results */}
            <div className="w-64 sm:w-80 bg-white border-r border-gray-200 overflow-y-auto shrink-0 hidden sm:block">
                <div className="p-4 border-b bg-gray-50">
                    <h4 className="font-semibold text-gray-700">অনুসন্ধান ফলাফল</h4>
                    <p className="text-xs text-gray-500 mt-1">
                        {isSearching ? 'খোঁজা হচ্ছে...' : results.length > 0 ? `${results.length} টি ফলাফল পাওয়া গেছে` : 'অনুসন্ধান করুন'}
                    </p>
                </div>
                
                {isSearching && (
                    <div className="p-8 flex justify-center text-emerald-600">
                        <LoaderIcon className="w-8 h-8 animate-spin" />
                    </div>
                )}

                <ul className="divide-y divide-gray-100">
                    {results.map((res, idx) => (
                        <li key={idx} onClick={() => handleResultClick(res)} className="p-4 hover:bg-emerald-50 cursor-pointer transition">
                            <div className="flex justify-between">
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">পৃষ্ঠা {res.page}</span>
                            </div>
                            <p className="text-sm text-gray-800 mt-2 line-clamp-2">"{res.snippet}"</p>
                        </li>
                    ))}
                    {!isSearching && searchTerm && results.length === 0 && (
                        <li className="p-4 text-center text-gray-500 text-sm">কোনো ফলাফল পাওয়া যায়নি</li>
                    )}
                </ul>
            </div>

            {/* Main PDF Area (Iframe or Mock) */}
            <div className="flex-1 overflow-auto flex justify-center p-0 relative bg-gray-500">
                {file.fileData ? (
                    <iframe 
                        src={file.fileData} 
                        className="w-full h-full border-0" 
                        title="PDF Viewer"
                    />
                ) : (
                    <div className="bg-white shadow-2xl w-full max-w-4xl min-h-[800px] p-8 sm:p-12 relative m-8">
                        {/* Simulated PDF Content */}
                        <div className="border-b-2 border-black mb-8 pb-4 text-center">
                            <h1 className="text-2xl font-bold font-serif mb-2">ভোটার তালিকা - ২০২৪</h1>
                            <p className="text-sm font-serif">{file.metadata.district}, {file.metadata.upazila}, {file.metadata.union}</p>
                            <p className="text-sm font-serif">ওয়ার্ড: {file.metadata.ward} | {file.name.split('/').pop()}</p>
                        </div>

                        <div className="space-y-6 font-serif text-sm text-gray-800 opacity-60 select-none cursor-not-allowed">
                            {/* Fake Content Blur */}
                            <p>1. নাম: রহিম উদ্দিন, পিতা: করিম উদ্দিন, গ্রাম: {file.metadata.para}, এনআইডি: ৮৭৩২৪৯৮৭৩২৪...</p>
                            <p>2. নাম: জব্বার আলী, পিতা: সোবহান আলী, গ্রাম: {file.metadata.para}, এনআইডি: ১২৩১২৩১২৩১২...</p>
                            <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
                            <div className="h-4 bg-gray-200 w-full rounded"></div>
                            <div className="h-4 bg-gray-200 w-5/6 rounded"></div>
                            <br/>
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-center text-gray-600">
                                (পিডিএফ ফাইলটি পাওয়া যায়নি বা ব্রাউজার রিফ্রেশ করা হয়েছে। নতুন করে আপলোড করুন।)
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};