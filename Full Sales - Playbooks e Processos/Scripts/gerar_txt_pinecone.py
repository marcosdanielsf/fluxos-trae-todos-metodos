import re
import os
from pathlib import Path


def limpar_markdown_e_metadados(texto: str) -> str:
    """
    Remove formatação Markdown, links/imagens e metadados comuns,
    deixando apenas texto plano adequado para embeddings (Pinecone).
    """
    # Remover imagens: ![alt](url) -> alt (ou vazio se preferir)
    texto = re.sub(r"!\[(.*?)\]\((.*?)\)", r"\1", texto)

    # Converter links Markdown: [texto](url) -> texto
    texto = re.sub(r"\[(.*?)\]\((.*?)\)", r"\1", texto)

    # Remover âncoras HTML/Markdown e URLs diretas
    texto = re.sub(r"https?://\S+", "", texto)

    # Remover cercas de código ``` e ~~~
    texto = re.sub(r"```+", "", texto)
    texto = re.sub(r"~~~+", "", texto)

    # Remover cabeçalhos Markdown (#, ##, ###) mantendo o conteúdo
    texto = re.sub(r"^\s*#{1,6}\s+", "", texto, flags=re.MULTILINE)

    # Remover marcadores de listas (-, *, +) e listas numeradas
    texto = re.sub(r"^\s*[-*+]\s+", "", texto, flags=re.MULTILINE)
    texto = re.sub(r"^\s*\d+\.\s+", "", texto, flags=re.MULTILINE)

    # Remover linhas de separação --- ou ***
    texto = re.sub(r"^\s*[-*_]{3,}\s*$", "", texto, flags=re.MULTILINE)

    # Remover metadados de contagem entre parênteses, exemplo: (8/8 extrações)
    texto = re.sub(r"\(\s*\d+\s*/\s*\d+[^)]*\)", "", texto)

    # Remover tabelas simples (pipes) mantendo o conteúdo sem formatação
    texto = texto.replace("|", " ")

    # Remover backticks inline mantendo conteúdo
    texto = texto.replace("`", "")

    # Remover possíveis tags HTML
    texto = re.sub(r"<[^>]+>", " ", texto)

    # Normalizações: espaços, quebras de linha e linhas vazias
    texto = re.sub(r"\r\n", "\n", texto)
    texto = re.sub(r"\t", " ", texto)
    texto = re.sub(r"\s+", " ", texto)
    texto = re.sub(r"\n\s+", "\n", texto)

    # Restaurar quebras de parágrafo mínimas: converter múltiplos espaços em único
    texto = re.sub(r"\s{2,}", " ", texto)

    # Opcional: colapsar múltiplas quebras de linha em uma
    texto = re.sub(r"\n{2,}", "\n", texto)

    # Trim final
    return texto.strip()


def processar_arquivos_markdown(origem_md: Path, destino_txt: Path) -> None:
    destino_txt.mkdir(parents=True, exist_ok=True)
    for md in sorted(origem_md.glob("*.md")):
        conteudo = md.read_text(encoding="utf-8", errors="ignore")
        limpo = limpar_markdown_e_metadados(conteudo)
        destino = destino_txt / (md.stem + ".txt")
        destino.write_text(limpo, encoding="utf-8")
        print(f"[OK] Gerado: {destino}")


def main():
    raiz = Path(__file__).resolve().parents[1]
    origem_md = raiz / "Relatorios" / "OCR" / "Markdown"
    destino_txt = raiz / "Relatorios" / "OCR" / "TXT_Pinecone"

    if not origem_md.exists():
        raise FileNotFoundError(f"Pasta de origem não encontrada: {origem_md}")

    processar_arquivos_markdown(origem_md, destino_txt)
    print("\nConcluído. TXT limpos disponíveis em:", destino_txt)


if __name__ == "__main__":
    main()