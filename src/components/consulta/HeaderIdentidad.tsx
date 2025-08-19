import unpLogo from '../../assets/Logo-unp-rojo.png';

type HeaderIdentidadProps = {
    titulo?: string;
};

export default function HeaderIdentidad({ }: HeaderIdentidadProps) {
    return (
        <header className="container mb-4">
            <div className="d-flex flex-column align-items-center text-center gap-3">
                {/* Logo */}
                <img
                    src={unpLogo}
                    alt="Logo Unidad Nacional de Protección"
                    className="img-fluid"
                    style={{ maxHeight: 100 }}
                />

                {/* Título */}
                <h3 className="fw-semibold mb-0" style={{ color: '#34c0fc' }}>
                    AQUA <span className="text-dark">–</span> Plan Democracia
                </h3>
            </div>
        </header>
    );
}
