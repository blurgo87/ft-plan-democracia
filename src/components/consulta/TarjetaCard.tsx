import { useMemo, useState } from "react";

type TarjetaCardProps = {
    kind: "web" | "social" | "gov" | "media";
    title: string;
    icon: string;
    items: string[];
    /** inicia colapsada (default: true) */
    defaultCollapsed?: boolean;
};

function splitUrl(u: string) {
    try {
        const url = new URL(u);
        const host = url.hostname.replace(/^www\./, "");
        const path = (url.pathname + url.search + url.hash) || "/";
        return { host, path };
    } catch {
        return { host: u, path: "" };
    }
}

export default function TarjetaCard({
    kind,
    title,
    icon,
    items,
    defaultCollapsed = true,
}: TarjetaCardProps) {
    const [open, setOpen] = useState<boolean>(!defaultCollapsed);
    const cardId = useMemo(
        () => `links-${kind}-${Math.random().toString(36).slice(2)}`,
        [kind]
    );

    return (
        <div className="col-12">
            <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-white border-0 d-flex align-items-center justify-content-between py-3">
                    <div className="d-flex align-items-center gap-2">
                        <span className="fs-4">{icon}</span>
                        <div>
                            <div className="fw-semibold">{title}</div>
                            <div className="small text-muted text-uppercase">{kind}</div>
                        </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <span className="badge text-bg-secondary">{items.length}</span>
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            aria-expanded={open ? "true" : "false"}
                            aria-controls={cardId}
                            onClick={() => setOpen(v => !v)}
                            style={{
                                "--bs-btn-color": "#7bd5fe",
                                "--bs-btn-border-color": "#7bd5fe",
                                "--bs-btn-hover-color": "#fff",
                                "--bs-btn-hover-bg": "#7bd5fe",
                                "--bs-btn-hover-border-color": "#7bd5fe",
                                "--bs-btn-focus-shadow-rgb": "123, 213, 254",
                                "--bs-btn-active-color": "#fff",
                                "--bs-btn-active-bg": "#5ecdfb",
                                "--bs-btn-active-border-color": "#5ecdfb",
                                transition: "all 0.25s ease-in-out",
                            } as React.CSSProperties}
                        >
                            {open ? "Ocultar" : "Mostrar"}
                        </button>

                    </div>
                </div>

                {open && (
                    <div id={cardId} className="card-body pt-0">
                        {/* grid ordenado y alineado: 1 col en móvil, 2 en >=md */}
                        <div className="row row-cols-1 row-cols-md-2 g-2">
                            {items.map((u, i) => {
                                const { host, path } = splitUrl(u);
                                return (
                                    <div className="col" key={i}>
                                        <a
                                            href={u}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="d-flex align-items-center justify-content-between gap-2 rounded-2 px-2 py-1 text-decoration-none"
                                            style={{ backgroundColor: "#f8f9fa", color: "#495057" }}
                                            title={u}
                                        >
                                            <span className="text-truncate">
                                                <span className="fw-semibold">{host}</span>
                                                <span className="text-muted"> {path}</span>
                                            </span>
                                            <span
                                                
                                            >
                                                ↗
                                            </span>
                                        </a>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
