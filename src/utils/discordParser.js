function escapeHtml(str) {
	return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function parseInline(text) {
	// Escapar caracteres con backslash
	text = text.replace(/\\([*_~|`#>\\])/g, "___ESC_$1___");

	// Código inline (primero, para protegerlo del resto)
	text = text.replace(/`(.+?)`/g, "<code>$1</code>");

	// Negrita + cursiva (orden: de más a menos asteriscos)
	text = text.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
	text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
	text = text.replace(/\*(.+?)\*/g, "<em>$1</em>");
	text = text.replace(/_(.+?)_/g, "<em>$1</em>");

	// Subrayado + combinaciones
	text = text.replace(
		/__\*\*\*(.+?)\*\*\*__/g,
		"<u><strong><em>$1</em></strong></u>",
	);
	text = text.replace(/__\*\*(.+?)\*\*__/g, "<u><strong>$1</strong></u>");
	text = text.replace(/__\*(.+?)\*__/g, "<u><em>$1</em></u>");
	text = text.replace(/__(.+?)__/g, "<u>$1</u>");

	// Tachado
	text = text.replace(/~~(.+?)~~/g, "<s>$1</s>");

	// Spoiler
	text = text.replace(
		/\|\|(.+?)\|\|/g,
		'<span class="discord-spoiler">$1</span>',
	);

	// Links enmascarados [texto](url)
	text = text.replace(
		/\[(.+?)\]\((https?:\/\/[^)]+)\)/g,
		'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
	);

	// Links sin preview <url>
	text = text.replace(
		/&lt;(https?:\/\/[^&]+)&gt;/g,
		'<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>',
	);

	// Restaurar escapes
	text = text.replace(/___ESC_(.+?)___/g, "$1");

	return text;
}

export function discordToHtml(rawText) {
	const lines = rawText.split("\n");
	let html = "";
	let i = 0;

	while (i < lines.length) {
		const line = lines[i];

		// Bloque de código ```lang
		if (line.startsWith("```")) {
			const lang = line.slice(3).trim();
			const codeLines = [];
			i++;
			while (i < lines.length && lines[i] !== "```") {
				codeLines.push(escapeHtml(lines[i]));
				i++;
			}
			html += `<pre><code class="lang-${escapeHtml(lang)}">${codeLines.join("\n")}</code></pre>`;
			i++;
			continue;
		}

		// Cita multilínea >>>
		if (line.startsWith(">>> ")) {
			const content = [line.slice(4)];
			i++;
			while (i < lines.length) {
				content.push(lines[i]);
				i++;
			}
			html += `<blockquote class="multi">${parseInline(content.join("\n"))}</blockquote>`;
			continue;
		}

		// Cita simple >
		if (line.startsWith("> ")) {
			html += `<blockquote>${parseInline(line.slice(2))}</blockquote>`;
			i++;
			continue;
		}

		// Encabezados
		if (line.startsWith("### ")) {
			html += `<h3>${parseInline(line.slice(4))}</h3>`;
			i++;
			continue;
		}
		if (line.startsWith("## ")) {
			html += `<h2>${parseInline(line.slice(3))}</h2>`;
			i++;
			continue;
		}
		if (line.startsWith("# ")) {
			html += `<h1>${parseInline(line.slice(2))}</h1>`;
			i++;
			continue;
		}

		// Subtexto -#
		if (line.startsWith("-# ")) {
			html += `<span class="subtext">${parseInline(line.slice(3))}</span>`;
			i++;
			continue;
		}

		// Lista
		if (line.startsWith("- ") || line.startsWith("* ")) {
			html += `<ul><li>${parseInline(line.slice(2))}</li></ul>`;
			i++;
			continue;
		}

		// Línea vacía
		if (line.trim() === "") {
			html += "<br>";
			i++;
			continue;
		}

		// Párrafo normal
		html += `<p>${parseInline(line)}</p>`;
		i++;
	}

	return html;
}
