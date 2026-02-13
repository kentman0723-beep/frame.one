import { Link } from 'react-router-dom';
import { Shield, FileText, Scale } from 'lucide-react';

export default function LegalFooter() {
    return (
        <footer className="app-footer">
            <div className="footer-inner">
                <div className="footer-links">
                    <Link to="/terms" className="footer-link">
                        <FileText size={16} />
                        利用規約
                    </Link>
                    <span style={{ color: 'rgba(100,116,139,0.3)' }}>|</span>
                    <Link to="/privacy" className="footer-link">
                        <Shield size={16} />
                        プライバシーポリシー
                    </Link>
                    <span style={{ color: 'rgba(100,116,139,0.3)' }}>|</span>
                    <Link to="/legal" className="footer-link">
                        <Scale size={16} />
                        特定商取引法に基づく表記
                    </Link>
                </div>
                <p className="footer-copy">
                    © 2026 FRAME.ONE — Precision Gaming Analytics. All rights reserved.
                </p>
                <p className="footer-tagline">
                    発生1フレームの差を制する
                </p>
            </div>
        </footer>
    );
}
