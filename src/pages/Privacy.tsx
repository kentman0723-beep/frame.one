import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export default function Privacy() {
    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-magenta/10 border border-magenta/20">
                        <Shield className="w-5 h-5 text-magenta" />
                    </div>
                    <h2 className="font-heading text-2xl font-bold tracking-wide">プライバシーポリシー</h2>
                </div>

                <div className="glass-card p-6 md:p-8 space-y-6 text-sm text-text-dim leading-relaxed">
                    <section>
                        <h3 className="font-heading text-base font-semibold text-text mb-3">1. 個人情報の収集</h3>
                        <p>本サービスでは、ユーザー登録時および利用時に以下の情報を収集する場合があります。</p>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                            <li>メールアドレス</li>
                            <li>表示名（ニックネーム）</li>
                            <li>ゲームに関する統計データ（戦績、対策メモ等）</li>
                            <li>決済に関する情報（有料プラン利用時）</li>
                            <li>利用ログ、アクセス情報</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="font-heading text-base font-semibold text-text mb-3">2. 個人情報の利用目的</h3>
                        <ul className="list-disc list-inside space-y-1">
                            <li>本サービスの提供・運営のため</li>
                            <li>ユーザーからのお問い合わせに対応するため</li>
                            <li>有料サービスの料金を請求するため</li>
                            <li>メンテナンス、重要なお知らせ等の通知のため</li>
                            <li>利用規約に違反したユーザーを特定し、ご連絡するため</li>
                            <li>サービスの改善・新機能開発のため</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="font-heading text-base font-semibold text-text mb-3">3. 第三者への提供</h3>
                        <p>当社は、以下の場合を除き、個人情報を第三者に提供いたしません。</p>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                            <li>ユーザーの同意がある場合</li>
                            <li>法令に基づく場合</li>
                            <li>人の生命、身体又は財産の保護のために必要がある場合</li>
                            <li>決済処理のため、決済代行業者に対して必要な範囲で提供する場合</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="font-heading text-base font-semibold text-text mb-3">4. データの保管</h3>
                        <p>ユーザーのゲームデータ（戦績・対策メモ等）は、現時点ではユーザーのブラウザ（ローカルストレージ）に保存されます。有料プランでは、サーバー側のデータベースに安全に保存され、デバイス間の同期が可能になります。</p>
                    </section>

                    <section>
                        <h3 className="font-heading text-base font-semibold text-text mb-3">5. Cookieの使用</h3>
                        <p>本サービスでは、ユーザーの利便性向上およびアクセス解析のためにCookieを使用する場合があります。ブラウザの設定により、Cookieの受け入れを拒否することが可能ですが、一部のサービスが利用できなくなる場合があります。</p>
                    </section>

                    <section>
                        <h3 className="font-heading text-base font-semibold text-text mb-3">6. プライバシーポリシーの変更</h3>
                        <p>本ポリシーの内容は、法令の改正その他の事由により、ユーザーに通知することなく変更することがあります。変更後のプライバシーポリシーは、本ウェブサイトに掲載した時点で効力を生じるものとします。</p>
                    </section>

                    <section>
                        <h3 className="font-heading text-base font-semibold text-text mb-3">7. お問い合わせ</h3>
                        <p>本ポリシーに関するお問い合わせは、サービス内のお問い合わせフォームよりお願いいたします。</p>
                    </section>

                    <div className="pt-4 border-t border-glass-border">
                        <p className="text-xs text-text-muted">最終更新日: 2026年2月11日</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
