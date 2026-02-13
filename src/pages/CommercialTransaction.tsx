import { motion } from 'framer-motion';
import { Scale } from 'lucide-react';

export default function CommercialTransaction() {
    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-cyan/10 border border-cyan/20">
                        <Scale className="w-5 h-5 text-cyan" />
                    </div>
                    <h2 className="font-heading text-2xl font-bold tracking-wide">特定商取引法に基づく表記</h2>
                </div>

                <div className="glass-card p-6 md:p-8">
                    <table className="w-full text-sm">
                        <tbody className="divide-y divide-glass-border">
                            {[
                                ['販売事業者', 'FRAME.ONE 運営事務局'],
                                ['運営責任者', '（責任者名を記載）'],
                                ['所在地', '（住所を記載）'],
                                ['電話番号', '（電話番号を記載）'],
                                ['メールアドレス', 'support@frameone.app'],
                                ['販売URL', 'https://frameone.app'],
                                ['販売価格', 'Starter: 無料 / Pro: 月額500円（税込）/ Elite: 月額1,000円（税込）'],
                                ['追加手数料', '決済手段により追加の手数料が発生する場合があります'],
                                ['お支払い方法', 'クレジットカード（Visa, Mastercard, JCB, American Express）'],
                                ['お支払い時期', 'プラン登録時に初回決済。以降、毎月同日に自動課金'],
                                ['サービス提供時期', 'お支払い完了後、即時利用開始'],
                                ['キャンセル・返金', '初回決済日から14日以内であれば全額返金。解約は次回請求日の前日まで受付。解約後も請求期間終了まで利用可能'],
                                ['動作環境', 'Google Chrome、Firefox、Safari、Microsoft Edge の最新版に対応'],
                            ].map(([label, value]) => (
                                <tr key={label}>
                                    <td className="py-4 pr-6 text-text-muted font-medium whitespace-nowrap align-top w-40">
                                        {label}
                                    </td>
                                    <td className="py-4 text-text-dim">{value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-6 pt-4 border-t border-glass-border">
                        <p className="text-xs text-text-muted">
                            ※ 上記の情報は表示例です。実際の運用時には、法令に基づき正確な情報を記載してください。
                        </p>
                        <p className="text-xs text-text-muted mt-1">最終更新日: 2026年2月11日</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
