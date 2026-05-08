import { useRef, useState, useEffect } from "react";
import Toolbar from "./Toolbar";
import { discordToHtml } from "./utils/discordParser";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

const TRANSLATIONS = {
	es: {
		title: "Discord Formatter",
		subtitle: "Formatea texto para Discord en formato Markdown",
		editor: "Editor",
		preview: "Preview Discord",
		copy: "Copiar texto",
		clear: "Limpiar",
		placeholder: `**negrita**, *cursiva*, __subrayado__\n~~tachado~~, ||spoiler||\n\`código\`, \`\`\`bloque\`\`\`\n# Encabezado\n> cita`,
		copied: "¡Texto copiado al portapapeles!",
		languageLabel: "Idioma",
	},
	en: {
		title: "Discord Formatter",
		subtitle: "Format text for Discord using Markdown",
		editor: "Editor",
		preview: "Discord Preview",
		copy: "Copy text",
		clear: "Clear",
		placeholder: `**bold**, *italic*, __underline__\n~~strikethrough~~, ||spoiler||\n\`code\`, \`\`\`block\`\`\`\n# Heading\n> quote`,
		copied: "Text copied to clipboard!",
		languageLabel: "Language",
	},
};

function App() {
	const [text, setText] = useState("");
	const editorRef = useRef(null);
	const [dark, setDark] = useState(true);
	const [lang, setLang] = useState(() => {
		const browserLang = navigator.language?.slice(0, 2);
		return browserLang === "es" ? "es" : "en";
	});

	const t = TRANSLATIONS[lang];

	useEffect(() => {
		document.documentElement.classList.toggle("dark", dark);
	}, [dark]);

	function wrap(before, after) {
		const textarea = editorRef.current;
		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const selected = text.substring(start, end);
		const newText =
			text.substring(0, start) +
			before +
			selected +
			after +
			text.substring(end);
		setText(newText);
		setTimeout(() => {
			textarea.focus();
			textarea.selectionStart = start + before.length;
			textarea.selectionEnd = end + before.length;
		}, 0);
	}

	function wrapBlock(before, after) {
		const textarea = editorRef.current;
		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const selected = text.substring(start, end) || "código aquí";
		const newText =
			text.substring(0, start) +
			before +
			selected +
			after +
			text.substring(end);
		setText(newText);
		setTimeout(() => textarea.focus(), 0);
	}

	function insertLine(prefix) {
		const textarea = editorRef.current;
		const pos = textarea.selectionStart;
		const lineStart = text.lastIndexOf("\n", pos - 1) + 1;
		const newText =
			text.substring(0, lineStart) + prefix + text.substring(lineStart);
		setText(newText);
		setTimeout(() => {
			textarea.selectionStart = textarea.selectionEnd = pos + prefix.length;
			textarea.focus();
		}, 0);
	}

	const charCount = text.length;
	const isOverLimit = charCount > 2000;

	return (
		<div className="relative min-h-screen text-foreground p-6 flex flex-col items-center justify-center">
			{dark ? (
				<>
					<div className="fixed inset-0 z-[-2] dark-bg" />
					<div className="dark-bg-dots" />
					<div
						className="dark-bg-orb z-[-1]"
						style={{ top: "-10%", left: "-20%" }}
					/>
					<div
						className="dark-bg-orb z-[-1]"
						style={{ top: "-10%", right: "-20%" }}
					/>
				</>
			) : (
				<>
					<div className="fixed inset-0 z-[-2] light-bg" />
					<div className="light-bg-dots z-[-1]" />
				</>
			)}

			<div className="w-full max-w-6xl space-y-6 md:space-y-10">
				{/* Header */}
				<div className="flex items-start justify-between gap-4">
					<div className="space-y-1">
						<h1 className="text-3xl font-bold">{t.title}</h1>
						<p className="text-lg text-muted-foreground">{t.subtitle}</p>
					</div>
					<div className="flex items-center gap-2 shrink-0">
						<Select value={lang} onValueChange={setLang}>
							<SelectTrigger className="w-32 cursor-pointer bg-background">
								<SelectValue />
							</SelectTrigger>
							<SelectContent position="popper">
								<SelectGroup>
									<SelectLabel>{t.languageLabel}</SelectLabel>
									<SelectItem value="es" className="cursor-pointer">
										<span className="fi fi-es mr-2" /> Español
									</SelectItem>
									<SelectItem value="en" className="cursor-pointer">
										<span className="fi fi-gb mr-2" /> English
									</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
						<Button
							variant="ghost"
							size="icon"
							className="cursor-pointer"
							onClick={() => setDark(!dark)}
						>
							{dark ? (
								<Sun className="h-5 w-5" />
							) : (
								<Moon className="h-5 w-5" />
							)}
						</Button>
					</div>
				</div>

				{/* Toolbar */}
				<Toolbar
					onWrap={wrap}
					onInsertLine={insertLine}
					onWrapBlock={wrapBlock}
					lang={lang}
				/>

				{/* Editor + Preview */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-1">
						<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
							{t.editor}
						</p>
						<textarea
							ref={editorRef}
							value={text}
							onChange={(e) => setText(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Tab") {
									e.preventDefault();
									const start = e.target.selectionStart;
									const end = e.target.selectionEnd;
									const newText =
										text.substring(0, start) + "  " + text.substring(end);
									setText(newText);
									setTimeout(() => {
										editorRef.current.selectionStart = start + 2;
										editorRef.current.selectionEnd = start + 2;
									}, 0);
								}
							}}
							placeholder={t.placeholder}
							className="w-full h-64 md:h-96 resize-y font-mono text-sm p-3 rounded-lg border glass bg-background focus:outline-none focus:ring-2 focus:ring-ring"
							spellCheck={false}
						/>
					</div>

					<div className="space-y-1">
						<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
							{t.preview}
						</p>
						<div
							className="w-full h-64 md:h-96 overflow-y-auto p-3 rounded-lg border discord-preview"
							dangerouslySetInnerHTML={{ __html: discordToHtml(text) }}
							onClick={(e) => {
								if (e.target.classList.contains("discord-spoiler")) {
									e.target.classList.toggle("revealed");
								}
							}}
						/>
					</div>
				</div>

				{/* Footer */}
				<div className="flex items-center justify-between">
					<span
						className={`text-xs ${isOverLimit ? "text-destructive" : "text-muted-foreground"}`}
					>
						{charCount} / 2000
					</span>
					<div className="flex gap-2">
						<Button
							size="sm"
							className="cursor-pointer"
							onClick={() => {
								navigator.clipboard.writeText(text);
								toast.success(t.copied);
							}}
						>
							{t.copy}
						</Button>
						<Button
							variant="destructive"
							size="sm"
							className="cursor-pointer"
							onClick={() => setText("")}
						>
							{t.clear}
						</Button>
					</div>
				</div>
			</div>

			<Toaster
				richColors
				theme={dark ? "dark" : "light"}
				position="top-center"
			/>
		</div>
	);
}

export default App;
