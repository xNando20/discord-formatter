import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

const getWrapButtons = (lang) => [
	{
		label: "B",
		before: "**",
		after: "**",
		tooltip: lang === "es" ? "Negrita — **texto**" : "Bold — **text**",
	},
	{
		label: "I",
		before: "*",
		after: "*",
		tooltip: lang === "es" ? "Cursiva — *texto*" : "Italic — *text*",
	},
	{
		label: "U",
		before: "__",
		after: "__",
		tooltip: lang === "es" ? "Subrayado — __texto__" : "Underline — __text__",
	},
	{
		label: "S",
		before: "~~",
		after: "~~",
		tooltip: lang === "es" ? "Tachado — ~~texto~~" : "Strikethrough — ~~text~~",
	},
	{
		label: "B+I",
		before: "***",
		after: "***",
		tooltip:
			lang === "es"
				? "Negrita y cursiva — ***texto***"
				: "Bold and italic — ***text***",
	},
	{
		label: "||?||",
		before: "||",
		after: "||",
		tooltip: lang === "es" ? "Spoiler — ||texto||" : "Spoiler — ||text||",
	},
	{
		label: "< >",
		before: "`",
		after: "`",
		tooltip: lang === "es" ? "Código inline — `texto`" : "Inline code — `text`",
	},
];

const getLineButtons = (lang) => [
	{
		label: "H1",
		prefix: "# ",
		tooltip:
			lang === "es" ? "Encabezado grande — # texto" : "Large header — # text",
	},
	{
		label: "H2",
		prefix: "## ",
		tooltip:
			lang === "es"
				? "Encabezado mediano — ## texto"
				: "Medium header — ## text",
	},
	{
		label: "H3",
		prefix: "### ",
		tooltip:
			lang === "es"
				? "Encabezado pequeño — ### texto"
				: "Small header — ### text",
	},
	{
		label: "-#",
		prefix: "-# ",
		tooltip: lang === "es" ? "Subtexto — -# texto" : "Subtext — -# text",
	},
	{
		label: ">",
		prefix: "> ",
		tooltip: lang === "es" ? "Cita — > texto" : "Quote — > text",
	},
	{
		label: ">>>",
		prefix: ">>> ",
		tooltip:
			lang === "es"
				? "Cita multilínea — >>> texto"
				: "Multiline quote — >>> text",
	},
	{
		label: "•",
		prefix: "- ",
		tooltip: lang === "es" ? "Lista — - texto" : "List — - text",
	},
];

function ToolbarButton({ label, tooltip, onClick }) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					onClick={onClick}
					className="font-mono text-sm h-8 px-2 hover:cursor-pointer"
				>
					{label}
				</Button>
			</TooltipTrigger>
			<TooltipContent side="bottom">
				<p className="font-mono font-medium text-sm">{tooltip}</p>
			</TooltipContent>
		</Tooltip>
	);
}

function Toolbar({ onWrap, onInsertLine, onWrapBlock, lang }) {
	const wrapButtons = getWrapButtons(lang);
	const lineButtons = getLineButtons(lang);
	const blockTooltip =
		lang === "es"
			? "Bloque de código — ```lenguaje"
			: "Code block — ```language";

	return (
		<div className="flex flex-wrap items-center gap-1 p-2 border rounded-lg bg-background glass">
			{/* Formato de texto */}
			<div className="flex items-center gap-1">
				{wrapButtons.map((btn) => (
					<ToolbarButton
						key={btn.label}
						label={btn.label}
						tooltip={btn.tooltip}
						onClick={() => onWrap(btn.before, btn.after)}
					/>
				))}
			</div>

			<Separator orientation="vertical" className="h-8 mx-1" />

			{/* Bloque de código */}
			<ToolbarButton
				label={lang === "es" ? "``` bloque" : "``` block"}
				tooltip={blockTooltip}
				onClick={() => onWrapBlock("```\n", "\n```")}
			/>

			<Separator orientation="vertical" className="h-8 mx-1" />

			{/* Elementos de línea */}
			<div className="flex items-center gap-1">
				{lineButtons.map((btn) => (
					<ToolbarButton
						key={btn.label}
						label={btn.label}
						tooltip={btn.tooltip}
						onClick={() => onInsertLine(btn.prefix)}
					/>
				))}
			</div>
		</div>
	);
}

export default Toolbar;
