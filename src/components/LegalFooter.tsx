import { Link } from 'react-router-dom';
import { Shield, FileText, Scale } from 'lucide-react';

export default function LegalFooter() {
    return (
        <footer className="border-t border-glass-border bg-void-light/50">
            <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8">
                {/* Links */}
                <div className="flex flex-wrap items-center justify-center gap-6 mb-6">
                    <Link
                        to="/terms"
                        className="flex items-center gap-2 text-sm text-text-dim hover:text-cyan transition-colors"
                    >
                        <FileText className="w-4 h-4" />
                        利用規約
                    </Link>
                    <span className="text-text-muted/30">|</span>
                    <Link
                        to="/privacy"
                        className="flex items-center gap-2 text-sm text-text-dim hover:text-cyan transition-colors"
                    >
                        <Shield className="w-4 h-4" />
                        プライバシーポリシー
                    </Link>
                    <span className="text-text-muted/30">|</span>
                    <Link
                        to="/legal"
                        className="flex items-center gap-2 text-sm text-text-dim hover:text-cyan transition-colors"
                    >
                        <Scale className="w-4 h-4" />
                        特定商取引法に基づく表記
                    </Link>
                </div>

                {/* Copyright */}
                <div className="text-center">
                    <p className="text-xs text-text-muted">
                        © 2026 FRAME.ONE — Precision Gaming Analytics. All rights reserved.
                    </p>
                    <p className="text-xs text-text-muted/50 mt-1">
                        発生1フレームの差を制する
                    </p>
                </div>
            </div>
        </footer>
    );
}
