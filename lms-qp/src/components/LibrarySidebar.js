// components/LibrarySidebar.js
const LibrarySidebar = ({ selectedType, onTypeChange }) => {
  const types = [
    { value: 'all', label: 'Tất cả', icon: '📄' },
    { value: 'pdf', label: 'PDF', icon: '📕' },
    { value: 'docx', label: 'Word', icon: '📝' },
    { value: 'pptx', label: 'PowerPoint', icon: '📊' }
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="font-bold text-lg mb-4">Loại tài liệu</h3>
      <div className="space-y-2">
        {types.map(type => (
          <button
            key={type.value}
            onClick={() => onTypeChange(type.value)}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition ${
              selectedType === type.value 
                ? 'bg-blue-600 text-white' 
                : 'hover:bg-gray-100'
            }`}
          >
            <span className="text-xl">{type.icon}</span>
            <span className="font-medium">{type.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LibrarySidebar;