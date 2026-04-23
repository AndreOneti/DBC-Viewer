export async function copyToClipboard(texto: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(texto);
    console.log('Texto copiado para a área de transferência!');
  } catch (error) {
    console.error('Erro ao copiar texto para a área de transferência:', error);
  }
}
