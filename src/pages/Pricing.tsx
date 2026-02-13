import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Check,
    X,
    Zap,
    Crown,
    Rocket,
    ChevronDown,
    Shield,
    BarChart3,
    Palette,
    Video,
    Users,
    Headphones,
    Infinity,
    Ban,
} from 'lucide-react';

const plans = [
    {
        name: 'Starter',
        price: 'Free',
        priceNote: '無料',
        icon: Zap,
        color: 'cyan',
        popular: false,
        features: [
            { text: '戦績ログ 50件まで', included: true },
            { text: '基本ダッシュボード', included: true },
            { text: '対策ノート 3件', included: true },
            { text: '広告あり', included: true, negative: true },
            { text: '詳細分析', included: false },
            { text: 'カスタムテーマ', included: false },
            { text: '動画解析', included: false },
        ],
    },
    {
        name: 'Pro',
        price: '¥500',
        priceNote: '/月',
        icon: Crown,
        color: 'magenta',
        popular: true,
        features: [
            { text: 'ログ無制限', included: true, icon: Infinity },
            { text: '高度な分析ダッシュボード', included: true, icon: BarChart3 },
            { text: '対策ノート無制限', included: true },
            { text: '広告なし', included: true, icon: Ban },
            { text: 'カスタムテーマ & ダークモード', included: true, icon: Palette },
            { text: '動画解析', included: false },
            { text: 'チーム共有', included: false },
        ],
    },
    {
        name: 'Elite',
        price: '¥1,000',
        priceNote: '/月',
        icon: Rocket,
        color: 'gold',
        popular: false,
        features: [
            { text: 'Proの全機能', included: true },
            { text: '動画解析 (AI対応)', included: true, icon: Video },
            { text: 'チーム共有', included: true, icon: Users },
            { text: '優先サポート', included: true, icon: Headphones },
            { text: 'APIアクセス', included: true },
            { text: '早期アクセス機能', included: true },
            { text: 'カスタムレポート', included: true },
        ],
    },
];

const faqs = [
    {
        q: 'プランの変更やキャンセルはいつでも可能ですか？',
        a: 'はい、いつでも可能です。プラン変更は即座に反映され、キャンセルは次回請求日まで現在のプランが利用できます。',
    },
    {
        q: '無料プランから有料プランへの移行でデータは引き継がれますか？',
        a: 'もちろんです。全てのデータはそのまま引き継がれ、保存上限も即座に解放されます。',
    },
    {
        q: '支払い方法は何に対応していますか？',
        a: 'クレジットカード（Visa, Mastercard, JCBなど）に対応しています。今後、コンビニ払いなども追加予定です。',
    },
    {
        q: '返金ポリシーについて教えてください。',
        a: '初回決済日から14日以内であれば、全額返金いたします。詳細は利用規約をご確認ください。',
    },
    {
        q: 'チーム共有機能とは何ですか？',
        a: 'Eliteプランでは、チームメンバーを招待して対策ノートや分析データを共有できます。プロチームでの練習トラッキングに最適です。',
    },
];

export default function Pricing() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <div className="space-y-12 max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-heading text-3xl md:text-4xl font-bold tracking-wide"
                >
                    CHOOSE YOUR <span className="gradient-text">PLAN</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-text-dim mt-3 max-w-lg mx-auto"
                >
                    あなたの成長ステージに合わせた最適なプランを選択してください
                </motion.p>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan, i) => (
                    <motion.div
                        key={plan.name}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`relative glass-card p-6 flex flex-col ${plan.popular ? 'glow-magenta border-magenta/30' : ''
                            }`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-magenta to-cyan text-void text-xs font-bold">
                                🔥 人気 No.1
                            </div>
                        )}

                        <div className="text-center mb-6 pt-2">
                            <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center ${plan.color === 'cyan' ? 'bg-cyan/10 border border-cyan/20' :
                                    plan.color === 'magenta' ? 'bg-magenta/10 border border-magenta/20' :
                                        'bg-amber-500/10 border border-amber-500/20'
                                }`}>
                                <plan.icon className={`w-6 h-6 ${plan.color === 'cyan' ? 'text-cyan' :
                                        plan.color === 'magenta' ? 'text-magenta' :
                                            'text-amber-400'
                                    }`} />
                            </div>
                            <h3 className="font-heading text-lg font-bold tracking-wider">{plan.name}</h3>
                            <div className="mt-2">
                                <span className="font-heading text-3xl font-bold">{plan.price}</span>
                                <span className="text-text-muted text-sm">{plan.priceNote}</span>
                            </div>
                        </div>

                        <div className="flex-1 space-y-3 mb-6">
                            {plan.features.map((feature, fi) => (
                                <div key={fi} className="flex items-center gap-3">
                                    {feature.included ? (
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${(feature as { negative?: boolean }).negative
                                                ? 'bg-warning/10'
                                                : plan.color === 'magenta' ? 'bg-magenta/15' :
                                                    plan.color === 'gold' ? 'bg-amber-500/15' : 'bg-cyan/15'
                                            }`}>
                                            {(feature as { negative?: boolean }).negative ? (
                                                <X className="w-3 h-3 text-warning" />
                                            ) : (
                                                <Check className={`w-3 h-3 ${plan.color === 'magenta' ? 'text-magenta' :
                                                        plan.color === 'gold' ? 'text-amber-400' : 'text-cyan'
                                                    }`} />
                                            )}
                                        </div>
                                    ) : (
                                        <div className="w-5 h-5 rounded-full bg-void-lighter flex items-center justify-center flex-shrink-0">
                                            <X className="w-3 h-3 text-text-muted/50" />
                                        </div>
                                    )}
                                    <span className={`text-sm ${feature.included ? 'text-text' : 'text-text-muted/50'}`}>
                                        {feature.text}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <button className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${plan.popular
                                ? 'bg-gradient-to-r from-magenta to-magenta/70 text-white hover:from-magenta hover:to-magenta/90 glow-magenta'
                                : plan.color === 'gold'
                                    ? 'bg-gradient-to-r from-amber-500/80 to-amber-600/60 text-void hover:from-amber-500 hover:to-amber-600/80'
                                    : 'bg-void-lighter border border-glass-border text-text hover:border-cyan/30 hover:bg-cyan/5'
                            }`}>
                            {plan.price === 'Free' ? '無料で始める' : 'プランを選択'}
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* FAQ Section */}
            <div className="max-w-3xl mx-auto">
                <h3 className="font-heading text-xl font-bold text-center mb-8 tracking-wide">
                    <Shield className="inline w-5 h-5 text-cyan mr-2" />
                    FAQ
                </h3>
                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-card overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-glass-hover transition-colors"
                            >
                                <span className="text-sm font-medium text-text">{faq.q}</span>
                                <ChevronDown className={`w-4 h-4 text-text-muted flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''
                                    }`} />
                            </button>
                            <AnimatePresence>
                                {openFaq === i && (
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: 'auto' }}
                                        exit={{ height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <p className="px-5 pb-4 text-sm text-text-dim leading-relaxed">{faq.a}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Legal Link */}
            <div className="text-center">
                <Link
                    to="/legal"
                    className="text-xs text-text-muted hover:text-cyan transition-colors underline underline-offset-4"
                >
                    特定商取引法に基づく表記
                </Link>
            </div>
        </div>
    );
}
