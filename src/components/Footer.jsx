import { Send, Github, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 text-white py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Project Info */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-2">Agent Skills Academy</h3>
            <p className="text-indigo-200 text-sm">
              Мастерство агентных систем Claude AI
            </p>
          </div>

          {/* Center: Links */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a
              href="https://t.me/llm_notes"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-indigo-200 hover:text-white transition-colors group"
            >
              <Send size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              <span className="font-semibold">Telegram канал</span>
            </a>

            <a
              href="https://github.com/dzhechko/agent-skills-academy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-indigo-200 hover:text-white transition-colors group"
            >
              <Github size={20} className="group-hover:rotate-12 transition-transform" />
              <span className="font-semibold">GitHub</span>
            </a>

            <a
              href="https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-200 hover:text-white transition-colors text-sm"
            >
              Оригинальная статья Claude Docs
            </a>
          </div>

          {/* Right: Made with Love */}
          <div className="flex items-center gap-2 text-indigo-200 text-sm">
            <span>Создано с</span>
            <Heart size={16} className="fill-red-400 text-red-400 animate-pulse" />
            <span>для обучения</span>
          </div>
        </div>

        {/* Bottom: License */}
        <div className="mt-6 pt-6 border-t border-indigo-700 text-center text-indigo-300 text-xs">
          <p>
            © 2026 Agent Skills Academy. Материалы основаны на{' '}
            <a
              href="https://platform.claude.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white"
            >
              официальной документации Anthropic Claude
            </a>
            . Открытый исходный код под лицензией MIT.
          </p>
        </div>
      </div>
    </footer>
  );
}
