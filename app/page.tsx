export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Avatar */}
          <div className="mb-8 flex justify-center">
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-1 shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-6xl">
                👨‍💼
              </div>
            </div>
          </div>

          {/* Name & Title */}
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
            秦博
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8">
            15年央企工作经验 · 物贸业务经营专家
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 rounded-full shadow-lg">
            <span className="text-slate-700 dark:text-slate-300">破局行动家</span>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 md:p-12 backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="text-4xl">👤</span>
              关于我
            </h2>
            <div className="space-y-4 text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
              <p>担任经营业务负责人多年，拥有丰富的从业经验</p>
              <p>擅长解决经营问题、指导思路与方向</p>
              <p>曾率领团队斩获<span className="font-semibold text-indigo-600 dark:text-indigo-400">100亿以上</span>经营承揽订单</p>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center flex items-center justify-center gap-3">
            <span className="text-4xl">🎯</span>
            专业技能
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: "📊", title: "高级经济师", desc: "专业经济管理资质" },
              { icon: "⚖️", title: "企业合规师", desc: "企业合规管理专家" },
              { icon: "🤖", title: "二级AI建筑师", desc: "人工智能应用专家" },
              { icon: "🔧", title: "影刀二级证书", desc: "自动化工具认证" },
            ].map((skill, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-4xl mb-3">{skill.icon}</div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  {skill.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">{skill.desc}</p>
              </div>
            ))}
          </div>

          {/* Additional Skill */}
          <div className="mt-6 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl p-6 shadow-xl text-white">
            <div className="flex items-center gap-4">
              <span className="text-4xl">👥</span>
              <div>
                <h3 className="text-xl font-semibold mb-1">团队管理经验</h3>
                <p className="text-indigo-100">丰富的经营管理团队经验</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center flex items-center justify-center gap-3">
            <span className="text-4xl">🏆</span>
            主要成就
          </h2>
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border-l-4 border-indigo-500">
              <div className="flex items-start gap-4">
                <span className="text-5xl">💼</span>
                <div>
                  <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
                    百亿订单成就
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-lg">
                    率领团队斩获100亿以上经营承揽订单
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border-l-4 border-blue-500">
              <div className="flex items-start gap-4">
                <span className="text-5xl">✍️</span>
                <div>
                  <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
                    破局代写行动
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-lg">
                    首月破6000元订单
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent mb-8"></div>
          <p className="text-slate-600 dark:text-slate-400">
            © 2025 秦博. 专注于物贸业务经营与发展
          </p>
        </div>
      </footer>
    </div>
  );
}
