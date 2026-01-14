import { Github, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Project Info */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-2">Agent Skills Academy</h3>
            <p className="text-indigo-200 text-sm">
              Интерактивное обучение агентным системам Claude AI
            </p>
          </div>

          {/* Right: Links */}
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/dzhechko/agent-skills-academy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-indigo-300 transition"
            >
              <Github size={20} />
              <span className="text-sm font-semibold">GitHub</span>
            </a>
            
            <a
              href="https://t.me/llm_notes"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-indigo-300 transition"
            >
              <Send size={20} />
              <span className="text-sm font-semibold">Telegram</span>
            </a>
          </div>
        </div>

        {/* Bottom: Copyright */}
        <div className="text-center mt-6 pt-6 border-t border-indigo-800">
          <p className="text-indigo-300 text-sm">
            © {new Date().getFullYear()} Agent Skills Academy. Основано на{' '}
            <a
              href="https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white transition"
            >
              Claude AI Documentation
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
