export interface Signal {
  name: string;
  startBit: number;
  bitLength: number;
  byteOrder: string;
  valueType: string;
  factor: number;
  offset: number;
  min: number;
  max: number;
  unit: string;
  receivers: string[];
  comment?: string;
  values?: { [key: string]: string };
}

export interface Message {
  id: number;
  name: string;
  dlc: number;
  sender: string;
  signals: Signal[];
  comment?: string;
  priority?: number;
}

export interface DBCData {
  name?: string;
  messages: Message[];
  version?: string;
  newSymbols?: string[];
  bitTiming?: string;
  nodes?: string[];
  rawContent?: string;
}

export function parseDBCFile(content: string): DBCData {
  const lines = content.split('\n');
  const data: DBCData = {
    messages: [],
    nodes: [],
    rawContent: content,
  };

  const messageMap = new Map<number, Message>();
  const signalMap = new Map<string, Signal>();

  let currentMessage: Message | null = null;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (line.startsWith('VERSION')) {
      data.version = line.match(/"([^"]*)"/)?.[1] || '';
    }

    if (line.startsWith('BA_ "DBName"')) {
      data.name = line.split(' ')[2]?.match(/"([^"]*)"/)?.[1] || '';
    }

    if (line.startsWith('BU_:')) {
      const nodes = line.substring(4).trim().split(/\s+/);
      data.nodes = nodes.filter(n => n.length > 0);
    }

    if (line.startsWith('BO_ ')) {
      const match = line.match(/BO_\s+(\d+)\s+(\w+)\s*:\s*(\d+)\s+(\w+)/);
      if (match) {
        const id = parseInt(match[1]);
        currentMessage = {
          id,
          name: match[2],
          dlc: parseInt(match[3]),
          sender: match[4],
          signals: [],
        };
        messageMap.set(id, currentMessage);
        data.messages.push(currentMessage);
      }
    }

    if (line.startsWith('SG_ ') && currentMessage) {
      const match = line.match(
        /SG_\s+(\w+)\s*:\s*(\d+)\|(\d+)@([01])([+-])\s*\(([^,]+),([^)]+)\)\s*\[([^|]+)\|([^\]]+)\]\s*"([^"]*)"\s*(.+)/,
      );
      if (match) {
        const signal: Signal = {
          name: match[1],
          startBit: parseInt(match[2]),
          bitLength: parseInt(match[3]),
          byteOrder:
            match[4] === '0'
              ? 'Motorola (Big Endian)'
              : 'Intel (Little Endian)',
          valueType: match[5] === '+' ? 'Unsigned' : 'Signed',
          factor: parseFloat(match[6]),
          offset: parseFloat(match[7]),
          min: parseFloat(match[8]),
          max: parseFloat(match[9]),
          unit: match[10],
          receivers: match[11].split(',').map(r => r.trim()),
        };
        currentMessage.signals.push(signal);
        signalMap.set(`${currentMessage.id}_${signal.name}`, signal);
      }
    }

    if (line.startsWith('CM_ BO_ ')) {
      const match = line.match(/CM_\s+BO_\s+(\d+)\s+"([^"]*)"/);
      if (match) {
        const msgId = parseInt(match[1]);
        const msg = messageMap.get(msgId);
        if (msg) {
          msg.comment = match[2];
        }
      }
    }

    if (line.startsWith('CM_ SG_ ')) {
      const match = line.match(/CM_\s+SG_\s+(\d+)\s+(\w+)\s+"([^"]*)"/);
      if (match) {
        const msgId = parseInt(match[1]);
        const signalName = match[2];
        const signal = signalMap.get(`${msgId}_${signalName}`);
        if (signal) {
          signal.comment = match[3];
        }
      }
    }

    if (line.startsWith('VAL_ ')) {
      const match = line.match(/VAL_\s+(\d+)\s+(\w+)\s+(.+);/);
      if (match) {
        const msgId = parseInt(match[1]);
        const signalName = match[2];
        const valuesStr = match[3];
        const signal = signalMap.get(`${msgId}_${signalName}`);

        if (signal) {
          signal.values = {};
          const valueMatches = valuesStr.matchAll(/(\d+)\s+"([^"]+)"/g);
          for (const vm of valueMatches) {
            signal.values[vm[1]] = vm[2];
          }
        }
      }
    }

    if (
      line.startsWith('BA_ "GenMsgCycleTime"') ||
      line.includes('GenMsgCycleTime')
    ) {
      const match = line.match(/BA_\s+"GenMsgCycleTime"\s+BO_\s+(\d+)\s+(\d+)/);
      if (match) {
        const msgId = parseInt(match[1]);
        const msg = messageMap.get(msgId);
        if (msg) {
          msg.priority = parseInt(match[2]);
        }
      }
    }

    i++;
  }

  return data;
}
