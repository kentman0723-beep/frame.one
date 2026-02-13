import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

export default function Terms() {
    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-cyan/10 border border-cyan/20">
                        <FileText className="w-5 h-5 text-cyan" />
                    </div>
                    <h2 className="font-heading text-2xl font-bold tracking-wide">利用規約</h2>
                </div>

                <div className="glass-card p-6 md:p-8 space-y-6 text-sm text-text-dim leading-relaxed">
                    <section>
                        <h3 className="font-heading text-base font-semibold text-text mb-3">第1条（適用）</h3>
                        <p>本利用規約（以下「本規約」）は、FRAME.ONE（以下「本サービス」）の利用条件を定めるものです。登録ユーザーの皆さま（以下「ユーザー」）には、本規約に従って本サービスをご利用いただきます。</p>
                    </section>

                    <section>
                        <h3 className="font-heading text-base font-semibold text-text mb-3">第2条（利用登録）</h3>
                        <p>登録希望者が本規約に同意の上、当社の定める方法によって利用登録を申請し、当社がこれを承認することによって、利用登録が完了するものとします。</p>
                    </section>

                    <section>
                        <h3 className="font-heading text-base font-semibold text-text mb-3">第3条（ユーザーID及びパスワードの管理）</h3>
                        <p>ユーザーは、自己の責任において、本サービスのユーザーIDおよびパスワードを適切に管理するものとします。ユーザーIDおよびパスワードの不正使用に起因して生じた損害について、当社は一切の責任を負いません。</p>
                    </section>

                    <section>
                        <h3 className="font-heading text-base font-semibold text-text mb-3">第4条（禁止事項）</h3>
                        <ul className="list-disc list-inside space-y-1">
                            <li>法令又は公序良俗に違反する行為</li>
                            <li>犯罪行為に関連する行為</li>
                            <li>本サービスの他のユーザーの個人情報を不正に収集する行為</li>
                            <li>本サービスの運営を妨害する行為</li>
                            <li>他のユーザーに不利益、損害を与える行為</li>
                            <li>当社のサービスに関連して、反社会的勢力に対して直接又は間接的に利益を供与する行為</li>
                            <li>不正アクセス又はこれを試みる行為</li>
                            <li>その他、当社が不適切と判断する行為</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="font-heading text-base font-semibold text-text mb-3">第5条（サービスの提供の停止等）</h3>
                        <p>当社は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部又は一部の提供を停止又は中断することができるものとします。</p>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                            <li>本サービスにかかるコンピュータシステムの保守点検又は更新を行う場合</li>
                            <li>地震、落雷、火災、停電又は天災などの不可抗力により本サービスの提供が困難となった場合</li>
                            <li>その他、当社が本サービスの提供が困難と判断した場合</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="font-heading text-base font-semibold text-text mb-3">第6条（有料プランについて）</h3>
                        <p>有料プラン（Pro、Elite）の料金は月額制とし、登録日から1ヶ月ごとに課金されます。プラン変更やキャンセルは、次回請求日の前日まで可能です。初回決済日から14日以内の解約については全額返金いたします。</p>
                    </section>

                    <section>
                        <h3 className="font-heading text-base font-semibold text-text mb-3">第7条（ユーザー生成コンテンツ）</h3>
                        <p>ユーザーが本サービス上に登録するゲーム名、キャラクター名、メモ等（以下「ユーザーコンテンツ」）の責任は、当該ユーザーに帰属します。ユーザーは、第三者の知的財産権を侵害するコンテンツを登録しないものとします。</p>
                    </section>

                    <section>
                        <h3 className="font-heading text-base font-semibold text-text mb-3">第8条（準拠法・裁判管轄）</h3>
                        <p>本規約の解釈にあたっては、日本法を準拠法とします。本サービスに関して紛争が生じた場合には、東京地方裁判所を第一審の専属的合意管轄裁判所とします。</p>
                    </section>

                    <div className="pt-4 border-t border-glass-border">
                        <p className="text-xs text-text-muted">最終更新日: 2026年2月11日</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
