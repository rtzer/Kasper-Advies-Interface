import { Link } from "react-router-dom";
import { MessageSquare, Mail, Phone, Video, Inbox, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../components/layout/LanguageSwitcher";
import { ThemeSwitcher } from "../components/layout/ThemeSwitcher";

export default function FlowbiteIndex() {
  const { t } = useTranslation(['translation']);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Language and Theme Switchers */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>

      {/* Hero Section */}
      <section className="bg-white dark:bg-gray-900 border-b border-ka-gray-200 dark:border-gray-700">
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-ka-green rounded-2xl">
            <span className="text-white font-bold text-3xl">K</span>
          </div>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-ka-navy dark:text-white md:text-5xl lg:text-6xl">
            {t('translation:home.hero.title')}
          </h1>
          <p className="mb-8 text-lg font-normal text-ka-gray-600 dark:text-gray-400 lg:text-xl sm:px-16 xl:px-48">
            {t('translation:home.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
          <div className="max-w-screen-md mb-8 lg:mb-16">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-ka-navy dark:text-white">
              {t('translation:home.features.title')}
            </h2>
            <p className="text-ka-gray-600 dark:text-gray-400 sm:text-xl">
              {t('translation:home.features.subtitle')}
            </p>
          </div>
          
          <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-2 md:gap-12 md:space-y-0">
            {/* Unified Inbox Card */}
            <div className="p-6 bg-white border border-ka-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-ka-green/10 lg:h-12 lg:w-12 dark:bg-ka-green/20">
                <Inbox className="w-5 h-5 text-ka-green lg:w-6 lg:h-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-ka-navy dark:text-white">{t('translation:home.unified.title')}</h3>
              <p className="mb-4 text-ka-gray-600 dark:text-gray-400">
                {t('translation:home.unified.description')}
              </p>
              
              <ul className="mb-6 space-y-2 text-ka-gray-600 dark:text-gray-400">
                <li className="flex items-center space-x-2">
                  <svg className="flex-shrink-0 w-4 h-4 text-ka-green" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span>{t('translation:home.unified.feature1')}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="flex-shrink-0 w-4 h-4 text-ka-green" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span>{t('translation:home.unified.feature2')}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="flex-shrink-0 w-4 h-4 text-ka-green" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span>{t('translation:home.unified.feature3')}</span>
                </li>
              </ul>

              <Link to="/unified-inbox">
                <button className="inline-flex items-center justify-center w-full px-5 py-3 text-base font-medium text-center text-white bg-ka-navy rounded-lg hover:bg-ka-navy/90 focus:ring-4 focus:ring-ka-green/20 dark:bg-ka-green dark:hover:bg-ka-green/90 transition-colors">
                  {t('translation:home.unified.button')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </Link>
            </div>

            {/* Channel-Specific Card */}
            <div className="p-6 bg-white border border-ka-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-ka-green/10 lg:h-12 lg:w-12 dark:bg-ka-green/20">
                <MessageSquare className="w-5 h-5 text-ka-green lg:w-6 lg:h-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-ka-navy dark:text-white">{t('translation:home.perChannel.title')}</h3>
              <p className="mb-4 text-ka-gray-600 dark:text-gray-400">
                {t('translation:home.perChannel.description')}
              </p>
              
              <ul className="mb-6 space-y-2 text-ka-gray-600 dark:text-gray-400">
                <li className="flex items-center space-x-2">
                  <svg className="flex-shrink-0 w-4 h-4 text-ka-green" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span>{t('translation:home.perChannel.feature1')}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="flex-shrink-0 w-4 h-4 text-ka-green" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span>{t('translation:home.perChannel.feature2')}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="flex-shrink-0 w-4 h-4 text-ka-green" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span>{t('translation:home.perChannel.feature3')}</span>
                </li>
              </ul>

              <Link to="/channels/whatsapp">
                <button className="inline-flex items-center justify-center w-full px-5 py-3 text-base font-medium text-center text-white bg-ka-green rounded-lg hover:bg-ka-green/90 focus:ring-4 focus:ring-ka-green/20 dark:bg-ka-green dark:hover:bg-ka-green/90 transition-colors">
                  {t('translation:home.perChannel.button')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Channels Grid */}
      <section className="bg-gray-50 dark:bg-gray-800">
        <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
          <div className="max-w-screen-md mb-8 lg:mb-16">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-ka-navy dark:text-white">
              {t('translation:home.channels.title')}
            </h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Link to="/channels/whatsapp" className="flex flex-col items-center p-4 bg-white rounded-lg border border-ka-gray-200 dark:bg-gray-900 dark:border-gray-700 hover:shadow-md hover:border-ka-green transition-all">
              <MessageSquare className="w-8 h-8 mb-2 text-channel-whatsapp" />
              <span className="text-sm font-medium text-ka-navy dark:text-white">{t('translation:home.channels.whatsapp')}</span>
            </Link>
            <Link to="/channels/email" className="flex flex-col items-center p-4 bg-white rounded-lg border border-ka-gray-200 dark:bg-gray-900 dark:border-gray-700 hover:shadow-md hover:border-ka-green transition-all">
              <Mail className="w-8 h-8 mb-2 text-channel-email" />
              <span className="text-sm font-medium text-ka-navy dark:text-white">{t('translation:home.channels.email')}</span>
            </Link>
            <Link to="/channels/phone" className="flex flex-col items-center p-4 bg-white rounded-lg border border-ka-gray-200 dark:bg-gray-900 dark:border-gray-700 hover:shadow-md hover:border-ka-green transition-all">
              <Phone className="w-8 h-8 mb-2 text-channel-phone" />
              <span className="text-sm font-medium text-ka-navy dark:text-white">{t('translation:home.channels.phone')}</span>
            </Link>
            <Link to="/channels/video" className="flex flex-col items-center p-4 bg-white rounded-lg border border-ka-gray-200 dark:bg-gray-900 dark:border-gray-700 hover:shadow-md hover:border-ka-green transition-all">
              <Video className="w-8 h-8 mb-2 text-channel-video" />
              <span className="text-sm font-medium text-ka-navy dark:text-white">{t('translation:home.channels.video')}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
