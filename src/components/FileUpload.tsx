import { Upload } from 'lucide-react';
import { useRef } from 'react';

interface FileUploadProps {
  onFileLoad: (content: string, filename: string) => void;
}

export function FileUpload({ onFileLoad }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        const content = e.target?.result as string;
        onFileLoad(content, file.name);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className='w-full max-w-2xl mx-auto'>
      <div
        onClick={() => inputRef.current?.click()}
        className='border-2 border-dashed border-blue-300 rounded-lg p-12 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all'
      >
        <Upload className='w-12 h-12 mx-auto mb-4 text-blue-500' />
        <p className='text-lg font-medium text-gray-700 mb-2'>
          Clique para selecionar um arquivo .dbc
        </p>
        <p className='text-sm text-gray-500'>
          Arquivo de banco de dados CAN (Controller Area Network)
        </p>
        <input
          ref={inputRef}
          type='file'
          accept='.dbc'
          onChange={handleFileChange}
          className='hidden'
        />
      </div>
    </div>
  );
}
