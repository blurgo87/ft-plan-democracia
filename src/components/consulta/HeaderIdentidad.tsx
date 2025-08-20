import unpLogo from '../../assets/logoUNP.png';
import { Logo } from 'react-ecosistema-unp/ui';

type HeaderIdentidadProps = {
    titulo?: string;
};

export default function HeaderIdentidad({ }: HeaderIdentidadProps) {
    // Altura del contenedor de logos + título (ajústala si lo necesitas)

    return (
        <header className="container mb-0">
            <div
                className="d-flex align-items-center justify-content-between position-relative"
                style={{ height: 140 }}
            >
                {/* Logo izquierda */}
                <img
                    src={unpLogo}
                    alt="Logo Unidad Nacional de Protección"
                    style={{ height: '120px', width: 'auto' }}
                />

                {/* Título centrado absoluto */}
                <h4
                    className="fw-semibold mb-0 text-center position-absolute w-100"
                    style={{ color: '#303d50', lineHeight: 1 }}
                >
                    AQUA – PLAN DEMOCRACIA
                </h4>

                {/* Logo derecha */}
                <Logo
                    type="ecosistema"
                    variant="escudo"
                    color="azul"
                    height="110px"
                />
            </div>
        </header>


    );
}
