import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Radio,
  Info,
} from 'lucide-react';
import { Message, Signal } from '../utils/dbcParser';
import { copyToClipboard } from '../utils/clipboard';

type MessageViewProps = { message: Message };

export function MessageView({ message }: Readonly<MessageViewProps>) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className='border border-gray-200 rounded-lg mb-4 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow'>
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className='flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50'
      >
        <div className='flex items-center gap-3'>
          {isExpanded ? (
            <ChevronDown className='w-5 h-5 text-gray-500' />
          ) : (
            <ChevronRight className='w-5 h-5 text-gray-500' />
          )}
          <MessageSquare className='w-5 h-5 text-blue-600' />
          <div>
            <div className='flex items-center gap-2'>
              <span className='font-semibold text-gray-800'>
                {message.name}
              </span>
              <span
                className='text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded'
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  copyToClipboard(`0x${message.id.toString(16).toUpperCase()}`);
                }}
              >
                ID: 0x{message.id.toString(16).toUpperCase()}
              </span>
              <span className='text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded'>
                DLC: {message.dlc}
              </span>
            </div>
            <div className='text-sm text-gray-500 mt-1'>
              Sender: <span className='font-medium'>{message.sender}</span>
              {message.signals.length > 0 && (
                <span className='ml-3'>
                  {message.signals.length}{' '}
                  {message.signals.length === 1 ? 'sinal' : 'sinais'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className='border-t border-gray-200 bg-gray-50 p-4'>
          {message.comment && (
            <div className='mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded'>
              <div className='flex items-start gap-2'>
                <Info className='w-4 h-4 text-blue-600 mt-0.5' />
                <div>
                  <p className='text-sm font-medium text-blue-900 mb-1'>
                    Comentário da Mensagem
                  </p>
                  <p className='text-sm text-blue-800'>{message.comment}</p>
                </div>
              </div>
            </div>
          )}

          <div className='space-y-3'>
            {message.signals.map((signal, idx) => (
              <SignalView key={idx} signal={signal} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

type SignalViewProps = { signal: Signal };

function SignalView({ signal }: Readonly<SignalViewProps>) {
  const [showDetails, setShowDetails] = useState(false);

  const signalValues = signal.values || {};

  return (
    <div className='bg-white border border-gray-200 rounded-lg p-4'>
      <div className='cursor-pointer'>
        <div className='flex items-start justify-between'>
          <div className='flex items-start gap-3 flex-1'>
            <Radio className='w-5 h-5 text-green-600 mt-0.5' />
            <div className='flex-1'>
              <div
                className='flex items-center gap-2 mb-2'
                onClick={() => setShowDetails(!showDetails)}
              >
                <span className='font-medium text-gray-800'>{signal.name}</span>
                {showDetails ? (
                  <ChevronDown className='w-4 h-4 text-gray-400' />
                ) : (
                  <ChevronRight className='w-4 h-4 text-gray-400' />
                )}
              </div>

              <div
                className='grid grid-cols-2 gap-x-6 gap-y-2 text-sm'
                onClick={() => setShowDetails(!showDetails)}
              >
                <div>
                  <span className='text-gray-500'>Start Bit:</span>{' '}
                  <span className='font-medium text-gray-700'>
                    {signal.startBit}
                  </span>
                </div>
                <div>
                  <span className='text-gray-500'>Bit Length:</span>{' '}
                  <span className='font-medium text-gray-700'>
                    {signal.bitLength}
                  </span>
                </div>
                <div>
                  <span className='text-gray-500'>Byte Order:</span>{' '}
                  <span className='font-medium text-gray-700'>
                    {signal.byteOrder}
                  </span>
                </div>
                <div>
                  <span className='text-gray-500'>Value Type:</span>{' '}
                  <span className='font-medium text-gray-700'>
                    {signal.valueType}
                  </span>
                </div>
              </div>

              {showDetails && (
                <div className='mt-4 pt-4 border-t border-gray-200 space-y-3 cursor-default'>
                  <div className='grid grid-cols-2 gap-x-6 gap-y-2 text-sm'>
                    <div>
                      <span className='text-gray-500'>Factor:</span>{' '}
                      <span className='font-medium text-gray-700'>
                        {signal.factor}
                      </span>
                    </div>
                    <div>
                      <span className='text-gray-500'>Offset:</span>{' '}
                      <span className='font-medium text-gray-700'>
                        {signal.offset}
                      </span>
                    </div>
                    <div>
                      <span className='text-gray-500'>Min:</span>{' '}
                      <span className='font-medium text-gray-700'>
                        {signal.min}
                      </span>
                    </div>
                    <div>
                      <span className='text-gray-500'>Max:</span>{' '}
                      <span className='font-medium text-gray-700'>
                        {signal.max}
                      </span>
                    </div>
                    <div>
                      <span className='text-gray-500'>Unit:</span>{' '}
                      <span className='font-medium text-gray-700'>
                        {signal.unit || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className='text-gray-500'>Receivers:</span>{' '}
                      <span className='font-medium text-gray-700'>
                        {signal.receivers.join(', ')}
                      </span>
                    </div>
                  </div>

                  {signal.comment && (
                    <div className='p-3 bg-green-50 border-l-4 border-green-400 rounded'>
                      <p className='text-sm font-medium text-green-900 mb-1'>
                        Comentário
                      </p>
                      <p className='text-sm text-green-800'>{signal.comment}</p>
                    </div>
                  )}

                  {(signal.values || Object.keys(signalValues).length > 0) && (
                    <div className='p-3 bg-amber-50 border-l-4 border-amber-400 rounded'>
                      <div className='flex items-center justify-between mb-2'>
                        <p className='text-sm font-medium text-amber-900'>
                          Variações de Valores (BITs)
                        </p>
                      </div>

                      <div className='space-y-1'>
                        {Object.entries(signalValues).map(
                          ([value, description]) => (
                            <div
                              key={value}
                              className='text-sm text-amber-800 flex items-center gap-2'
                            >
                              <span className='font-mono bg-amber-100 px-2 py-0.5 rounded'>
                                {value}
                              </span>
                              <span>=</span>
                              <span>{description}</span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
