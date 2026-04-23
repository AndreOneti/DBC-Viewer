import { useState } from "react";
import { FileUpload } from "./FileUpload";
import { MessageView } from "./MessageView";
import { parseDBCFile, DBCData } from "../utils/dbcParser";
import { Database, Search, FileText } from "lucide-react";

export function DBCViewer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filename, setFilename] = useState<string>("");
  const [dbcData, setDbcData] = useState<DBCData | null>(null);

  const handleFileLoad = (content: string, name: string) => {
    try {
      const parsed = parseDBCFile(content);
      setDbcData(parsed);
      setFilename(name);
    } catch (error) {
      alert(
        "Erro ao processar o arquivo .dbc. Verifique se o formato está correto.",
      );
      console.error(error);
    }
  };

  const filteredMessages = dbcData?.messages.filter(
    (msg) =>
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.id.toString().includes(searchTerm) ||
      msg.signals.some((sig) =>
        sig.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Database className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">DBC Viewer</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Visualizador de arquivos CAN Database com sinais, mensagens e
            comentários
          </p>
        </div>

        {!dbcData ? (
          <FileUpload onFileLoad={handleFileLoad} />
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {filename}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {dbcData.messages.length} mensagens •{" "}
                      {dbcData.nodes?.length || 0} nós
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setDbcData(null);
                      setFilename("");
                      setSearchTerm("");
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Carregar outro arquivo
                  </button>
                </div>
              </div>

              {dbcData.name && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Nome:</span> {dbcData.name}
                </div>
              )}

              {dbcData.version && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Versão:</span> {dbcData.version}
                </div>
              )}

              {dbcData.nodes && dbcData.nodes.length > 0 && (
                <div className="mt-3 text-sm text-gray-600">
                  <span className="font-medium">Nós:</span>{" "}
                  <span className="font-mono">{dbcData.nodes.join(", ")}</span>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por mensagem ou sinal..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Mensagens{" "}
                {searchTerm && `(${filteredMessages?.length} resultados)`}
              </h3>
              <div className="space-y-2">
                {filteredMessages && filteredMessages.length > 0 ? (
                  filteredMessages.map((message) => (
                    <MessageView key={message.id} message={message} />
                  ))
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <p className="text-gray-500">Nenhuma mensagem encontrada</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="bg-gray-200 py-4 text-center mt-auto">
        <p className="text-gray-600">
          Copyright &copy; 2026 - Andre Oneti
        </p>
      </footer>
    </div>
  );
}
