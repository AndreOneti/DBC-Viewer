type Signal = {
  name: string;
  startBit: number;
  length: number;
  factor: number;
  offset: number;
  min: number;
  max: number;
  unit: string;
  receivers: string[];
  comment?: string; // 👈 NOVO
};

type Message = {
  id: number;
  name: string;
  dlc: number;
  transmitter: string;
  signals: Signal[];
  comment?: string; // 👈 NOVO
};

type DBC = {
  version: string;
  nodes: string[];
  messages: Message[];
};

export function generateDBC(dbc: DBC): string {
  let output = '';

  output += `VERSION "${dbc.version}"\n\n`;

  output += `NS_ :\n\tNS_DESC_\n\tCM_\n\tBA_DEF_\n\tBA_\n\tVAL_\n\n`;
  output += `BS_:\n\n`;

  output += `BU_: ${dbc.nodes.join(' ')}\n\n`;

  const comments: string[] = [];

  dbc.messages.forEach(msg => {
    output += `BO_ ${msg.id} ${msg.name}: ${msg.dlc} ${msg.transmitter}\n`;

    if (msg.comment) {
      comments.push(`CM_ BO_ ${msg.id} "${msg.comment}";`);
    }

    msg.signals.forEach(sig => {
      output += ` SG_ ${sig.name} : ${sig.startBit}|${sig.length}@1+ (${sig.factor},${sig.offset}) [${sig.min}|${sig.max}] "${sig.unit}" ${sig.receivers.join(',')}\n`;

      if (sig.comment) {
        comments.push(`CM_ SG_ ${msg.id} ${sig.name} "${sig.comment}";`);
      }
    });

    output += '\n';
  });

  // adiciona comentários no final (padrão comum)
  output += '\n\n\n';
  output += comments.join('\n');
  output.trim();
  output += '\n';

  return output;
}
