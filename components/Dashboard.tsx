// @ts-nocheck
const { useState, useRef } = window.React;
const { FileStatus } = window;
const { CheckCircleIcon, FileIcon, LoaderIcon, PlusIcon, SearchIcon, TrashIcon } = window;

window.Dashboard = ({ files, onUpload, onSelectFile }) => {
  const [district, setDistrict] = useState('রংপুর');
  const [upazila, setUpazila] = useState('বদরগঞ্জ');
  const [union, setUnion] = useState('বদরগঞ্জ পৌরসভা');
  const [ward, setWard] = useState('১');
  const [para, setPara] = useState('কলেজপাড়া');
  
  const [maleFile, setMaleFile] = useState(null);
  const [femaleFile, setFemaleFile] = useState(null);
  const [otherFiles, setOtherFiles] = useState([]);

  // Ref to clear inputs
  const maleInputRef = useRef(null);
  const femaleInputRef = useRef(null);

  const handleAddOther = () => {
    setOtherFiles([...otherFiles, { id: Date.now(), file: null }]);
  };

  const handleOtherFileChange = (id, file) => {
    setOtherFiles(otherFiles.map(f => f.id === id ? { ...f, file } : f));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!maleFile && !femaleFile && otherFiles.every(f => !f.file)) {
      alert("অন্তত একটি ফাইল আপলোড করুন");
      return;
    }

    const filesToUpload = [];
    if (maleFile) filesToUpload.push({ type: 'পুরুষ', file: maleFile });
    if (femaleFile) filesToUpload.push({ type: 'মহিলা', file: femaleFile });
    otherFiles.forEach((of, idx) => {
      if (of.file) filesToUpload.push({ type: `অন্যান্য-${idx + 1}`, file: of.file });
    });

    onUpload({ district, upazila, union, ward, para }, filesToUpload);
    
    // Reset form
    setMaleFile(null);
    setFemaleFile(null);
    setOtherFiles([]);
    if (maleInputRef.current) maleInputRef.current.value = '';
    if (femaleInputRef.current) femaleInputRef.current.value = '';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Upload Section */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white rounded-lg shadow p-6 border-t-4 border-emerald-600">
          <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">নতুন ভোটার লিস্ট আপলোড</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">জেলা</label>
              <input type="text" value={district} onChange={e => setDistrict(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 border p-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">উপজেলা/থানা</label>
              <input type="text" value={upazila} onChange={e => setUpazila(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 border p-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ইউনিয়ন/পৌরসভা/সিটি</label>
              <input type="text" value={union} onChange={e => setUnion(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 border p-2" required />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">ওয়ার্ড</label>
                <input type="text" value={ward} onChange={e => setWard(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 border p-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">পাড়া/মহল্লা</label>
                <input type="text" value={para} onChange={e => setPara(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 border p-2" required />
              </div>
            </div>

            <hr className="my-4" />

            {/* File Inputs */}
            <div className="space-y-3">
              <div className="bg-blue-50 p-3 rounded border border-blue-100">
                <label className="block text-sm font-bold text-blue-800 mb-1">পুরুষ ভোটার লিস্ট (PDF)</label>
                <input 
                  type="file" 
                  ref={maleInputRef}
                  accept="application/pdf"
                  onChange={e => setMaleFile(e.target.files ? e.target.files[0] : null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                />
              </div>

              <div className="bg-pink-50 p-3 rounded border border-pink-100">
                <label className="block text-sm font-bold text-pink-800 mb-1">মহিলা ভোটার লিস্ট (PDF)</label>
                <input 
                  type="file" 
                  ref={femaleInputRef}
                  accept="application/pdf"
                  onChange={e => setFemaleFile(e.target.files ? e.target.files[0] : null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-100 file:text-pink-700 hover:file:bg-pink-200"
                />
              </div>

              {otherFiles.map((of, index) => (
                 <div key={of.id} className="bg-gray-50 p-3 rounded border border-gray-200 relative">
                    <button type="button" onClick={() => setOtherFiles(otherFiles.filter(f => f.id !== of.id))} className="absolute top-1 right-1 text-gray-400 hover:text-red-500">
                        <TrashIcon className="w-4 h-4"/>
                    </button>
                   <label className="block text-sm font-bold text-gray-700 mb-1">অন্যান্য লিস্ট {index + 1}</label>
                   <input 
                     type="file" 
                     accept="application/pdf"
                     onChange={e => handleOtherFileChange(of.id, e.target.files ? e.target.files[0] : null)}
                     className="block w-full text-sm text-gray-500"
                   />
                 </div>
              ))}

              <button type="button" onClick={handleAddOther} className="flex items-center text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                <PlusIcon className="w-4 h-4 mr-1" />
                আরও যোগ করুন (হিজড়া/অন্যান্য)
              </button>
            </div>

            <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition shadow-lg mt-4">
              সাবমিট করুন
            </button>
          </form>
        </div>
      </div>

      {/* List Section */}
      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <FileIcon className="w-6 h-6 mr-2 text-emerald-600"/>
            সংরক্ষিত ভোটার লিস্ট
        </h2>

        {files.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center text-gray-400 border border-dashed border-gray-300">
            কোনো ফাইল আপলোড করা হয়নি
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {files.map((file) => (
                <li key={file.id} className="p-4 hover:bg-gray-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 break-all">{file.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      আপলোড: {new Date(file.uploadDate).toLocaleString('bn-BD')} | আপলোডার: {file.uploadedBy}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {file.status === FileStatus.PROCESSING || file.status === FileStatus.UPLOADING ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 animate-pulse">
                        <LoaderIcon className="w-3 h-3 mr-1 animate-spin"/>
                        OCR হচ্ছে...
                      </span>
                    ) : file.status === FileStatus.OCR_COMPLETE ? (
                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircleIcon className="w-3 h-3 mr-1"/>
                        OCR COMPLETE
                      </span>
                    ) : null}

                    <button 
                      onClick={() => onSelectFile(file)}
                      disabled={file.status !== FileStatus.OCR_COMPLETE}
                      className={`flex items-center px-4 py-2 rounded text-sm font-medium transition ${
                        file.status === FileStatus.OCR_COMPLETE 
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <SearchIcon className="w-4 h-4 mr-1" />
                      দেখুন
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};