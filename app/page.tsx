'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              秦博
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('about')} className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">关于</button>
              <button onClick={() => scrollToSection('stats')} className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">数据</button>
              <button onClick={() => scrollToSection('skills')} className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">技能</button>
              <button onClick={() => scrollToSection('timeline')} className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">历程</button>
              <button onClick={() => scrollToSection('services')} className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">服务</button>
              <button onClick={() => scrollToSection('contact')} className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">联系</button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? '🌞' : '🌙'}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 flex flex-col gap-4">
              <button onClick={() => scrollToSection('about')} className="text-left text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">关于</button>
              <button onClick={() => scrollToSection('stats')} className="text-left text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">数据</button>
              <button onClick={() => scrollToSection('skills')} className="text-left text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">技能</button>
              <button onClick={() => scrollToSection('timeline')} className="text-left text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">历程</button>
              <button onClick={() => scrollToSection('services')} className="text-left text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">服务</button>
              <button onClick={() => scrollToSection('contact')} className="text-left text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">联系</button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="text-left text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {darkMode ? '🌞 浅色模式' : '🌙 深色模式'}
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - Split Layout */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Info */}
            <div className="text-center md:text-left">
              <div className="inline-block mb-4 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium">
                破局行动家
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                秦博
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                15年央企工作经验<br/>
                物贸业务经营与发展专家
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <button
                  onClick={() => scrollToSection('contact')}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  立即咨询
                </button>
                <button
                  onClick={() => scrollToSection('services')}
                  className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-semibold border-2 border-slate-200 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-400 hover:scale-105 transition-all duration-300"
                >
                  查看服务
                </button>
              </div>
            </div>

            {/* Right: Avatar & Decorations */}
            <div className="relative flex justify-center">
              <div className="relative">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>

                {/* Avatar */}
                <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-2 shadow-2xl">
                  <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-8xl md:text-9xl">
                    👨‍💼
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-xl animate-bounce">
                  <div className="text-3xl">🏆</div>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-xl animate-bounce" style={{animationDelay: '0.5s'}}>
                  <div className="text-3xl">💼</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-16 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: '15+', label: '工作年限', icon: '📅' },
              { number: '100亿+', label: '订单金额', icon: '💰' },
              { number: '6000+', label: '首月收入', icon: '📈' },
              { number: '5+', label: '专业资质', icon: '🎓' },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 text-center"
              >
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-600 dark:text-slate-400 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-12 text-center">
              关于我
            </h2>
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 md:p-12 backdrop-blur-sm">
              <div className="space-y-6 text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                <p className="flex items-start gap-4">
                  <span className="text-3xl flex-shrink-0">👔</span>
                  <span>担任经营业务负责人多年，拥有丰富的从业经验</span>
                </p>
                <p className="flex items-start gap-4">
                  <span className="text-3xl flex-shrink-0">🎯</span>
                  <span>擅长解决经营问题、指导思路与方向</span>
                </p>
                <p className="flex items-start gap-4">
                  <span className="text-3xl flex-shrink-0">🏆</span>
                  <span>曾率领团队斩获<span className="font-semibold text-indigo-600 dark:text-indigo-400">100亿以上</span>经营承揽订单</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-12 text-center">
              专业技能
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {[
                { icon: '📊', title: '高级经济师', desc: '专业经济管理资质' },
                { icon: '⚖️', title: '企业合规师', desc: '企业合规管理专家' },
                { icon: '🤖', title: '二级AI建筑师', desc: '人工智能应用专家' },
                { icon: '🔧', title: '影刀二级证书', desc: '自动化工具认证' },
              ].map((skill, index) => (
                <div
                  key={index}
                  className="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{skill.icon}</div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    {skill.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">{skill.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl p-8 shadow-xl text-white">
              <div className="flex items-center gap-4">
                <span className="text-5xl">👥</span>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">团队管理经验</h3>
                  <p className="text-indigo-100 text-lg">丰富的经营管理团队经验，带领团队创造卓越业绩</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="timeline" className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-12 text-center">
              职业历程
            </h2>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-indigo-500"></div>

              <div className="space-y-12">
                {[
                  {
                    year: '2010-2025',
                    title: '央企经营业务负责人',
                    desc: '15年深耕物贸业务，率领团队斩获100亿+订单',
                    icon: '💼',
                    side: 'left'
                  },
                  {
                    year: '2023',
                    title: '破局行动家',
                    desc: '开启破局代写行动，首月收入破6000元',
                    icon: '🚀',
                    side: 'right'
                  },
                  {
                    year: '2024',
                    title: '多领域资质认证',
                    desc: '获得高级经济师、企业合规师、AI建筑师等专业认证',
                    icon: '🎓',
                    side: 'left'
                  },
                ].map((item, index) => (
                  <div key={index} className={`relative flex items-center ${item.side === 'right' ? 'md:flex-row-reverse' : ''}`}>
                    {/* Timeline dot */}
                    <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-blue-500 rounded-full transform -translate-x-2 md:-translate-x-2 z-10 ring-4 ring-white dark:ring-slate-900"></div>

                    {/* Content */}
                    <div className={`ml-20 md:ml-0 md:w-5/12 ${item.side === 'right' ? 'md:mr-auto md:ml-8' : 'md:ml-auto md:mr-8'}`}>
                      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-3xl">{item.icon}</span>
                          <span className="text-blue-600 dark:text-blue-400 font-semibold">{item.year}</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                        <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-12 text-center">
              服务内容
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: '💡',
                  title: '经营咨询',
                  desc: '提供物贸业务经营策略、市场分析、风险评估等专业咨询服务',
                  features: ['业务诊断', '策略规划', '风险管控']
                },
                {
                  icon: '📋',
                  title: '业务指导',
                  desc: '针对经营问题提供解决方案，指导业务发展思路与方向',
                  features: ['问题诊断', '方案设计', '执行辅导']
                },
                {
                  icon: '👥',
                  title: '团队培训',
                  desc: '分享丰富的团队管理经验，帮助提升团队经营能力',
                  features: ['管理培训', '经验分享', '能力提升']
                },
                {
                  icon: '✍️',
                  title: '破局代写',
                  desc: '提供专业的商业文案、方案策划等代写服务',
                  features: ['方案撰写', '文案策划', '材料优化']
                },
              ].map((service, index) => (
                <div
                  key={index}
                  className="group bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{service.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">{service.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((feature, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-12 text-center">
              联系方式
            </h2>
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-8 md:p-12 shadow-2xl text-white">
              <div className="text-center mb-8">
                <p className="text-xl md:text-2xl mb-4">期待与您合作</p>
                <p className="text-blue-100">如有任何咨询需求，欢迎通过以下方式联系我</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">📧</div>
                    <div>
                      <div className="font-semibold mb-1">邮箱</div>
                      <div className="text-blue-100">qinbo913@gmail.com</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">💬</div>
                    <div>
                      <div className="font-semibold mb-1">微信</div>
                      <div className="text-blue-100">请邮件联系获取</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <a
                  href="mailto:qinbo913@gmail.com"
                  className="inline-block px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  发送邮件
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent mb-8"></div>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              © 2025 秦博. 专注于物贸业务经营与发展
            </p>
            <p className="text-slate-500 dark:text-slate-500 text-sm">
              15年央企工作经验 · 破局行动家
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
