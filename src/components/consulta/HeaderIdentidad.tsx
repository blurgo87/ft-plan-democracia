import unpLogo from '../../assets/Logo-unp-rojo.png';

type HeaderIdentidadProps = {
    titulo?: string;
};

export default function HeaderIdentidad({ }: HeaderIdentidadProps) {
    return (
        <header className="text-center">
            <img
                src={unpLogo}
                alt="Logo Unidad Nacional de Protección"
                className="img-fluid mb-3"
                style={{ maxHeight: 200 }}
            />
            <h1 className="display-5 text-danger fw-semibold mb-1">Unidad Nacional de Protección</h1>
            <h1 className="text-danger fw-semibold mb-2">AQUA</h1>
            <h1 className="display-5 text-danger fw-semibold mb-2">Plan Democracia</h1>



        </header>
    );
}
