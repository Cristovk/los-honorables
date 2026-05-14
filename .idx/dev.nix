# Configuración de Firebase Studio para el proyecto Los Honorables
# Sistema de Democratización Legislativa Chilena

{ pkgs, ... }: {
  # Canal estable de nixpkgs
  channel = "stable-24.05";

  # Paquetes necesarios para el proyecto
  packages = [
    pkgs.nodejs_20        # Node.js LTS
    pkgs.bun             # Gestor de paquetes bun
    pkgs.typescript      # Compilador TypeScript
    pkgs.firebase-tools  # CLI de Firebase
    pkgs.jq              # Procesamiento JSON
    pkgs.curl            # Cliente HTTP
  ];

  # Variables de entorno del workspace
  env = {
    PORT = "6000";
    NODE_ENV = "development";
    BASE_URL = "https://opendata.camara.cl/camaradiputados/WServices/";
  };

  idx = {
    # Extensiones recomendadas para el desarrollo
    extensions = [
      "ms-vscode.vscode-typescript-next"     # TypeScript
      "firebase.firebase-explorer"          # Firebase Tools
      "esbenp.prettier-vscode"              # Prettier
      "dbaeumer.vscode-eslint"              # ESLint
    ];

    # Configuración de previews
    previews = {
      enable = true;
      previews = {
        # Preview para el servidor principal
        web = {
          command = [
            "bun"
            "run"
            "dev"
            "--"
            "--port"
            "$PORT"
            "--host"
            "0.0.0.0"
          ];
          manager = "web";
          env = {
            PORT = "$PORT";
          };
        };

        # Preview para funciones de Firebase (opcional)
        firebase-emulator = {
          command = [
            "firebase"
            "emulators:start"
            "--only"
            "functions,firestore"
          ];
          manager = "web";
          env = {
            PORT = "8080"; # Puerto por defecto del emulador
          };
        };
      };
    };

    # Hooks del ciclo de vida del workspace
    workspace = {
      # Ejecuta cuando el workspace se crea por primera vez
      onCreate = {
        # Instalar dependencias con bun
        bun-install = "bun install";
        # Build inicial del proyecto
        build-project = "bun run build";
      };

      # Ejecuta cuando el workspace se (re)inicia
      onStart = {
        # Instalar dependencias si no existen
        bun-install-if-needed = "if [ ! -d node_modules ]; then bun install; fi";
        # Iniciar watcher de TypeScript en background
        typescript-watch = "bun run build:watch &";
      };
    };
  };
}
