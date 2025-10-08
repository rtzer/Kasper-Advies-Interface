import { Link } from "react-router-dom";
import { MessageSquare, Mail, Phone, Video, Inbox, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../components/layout/LanguageSwitcher";
import { ThemeSwitcher } from "../components/layout/ThemeSwitcher";

export default function FlowbiteIndex() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Language and Theme Switchers */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>

      {/* Hero Section */}
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
            {t('home.hero.title')}
          </h1>
          <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
            {t('home.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
          <div className="max-w-screen-md mb-8 lg:mb-16">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
              {t('home.features.title')}
            </h2>
            <p className="text-gray-500 sm:text-xl dark:text-gray-400">
              {t('home.features.subtitle')}
            </p>
          </div>
          
          <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-2 md:gap-12 md:space-y-0">
            {/* Unified Inbox Card */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-blue-100 lg:h-12 lg:w-12 dark:bg-blue-900">
                <Inbox className="w-5 h-5 text-blue-600 lg:w-6 lg:h-6 dark:text-blue-300" />
              </div>
              <h3 className="mb-2 text-xl font-bold dark:text-white">{t('home.unified.title')}</h3>
              <p className="mb-4 text-gray-500 dark:text-gray-400">
                {t('home.unified.description')}
              </p>
              
              <ul className="mb-6 space-y-2 text-gray-500 dark:text-gray-400">
                <li className="flex items-center space-x-2">
                  <svg className="flex-shrink-0 w-4 h-4 text-blue-600 dark:text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span>{t('home.unified.feature1')}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="flex-shrink-0 w-4 h-4 text-blue-600 dark:text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span>{t('home.unified.feature2')}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="flex-shrink-0 w-4 h-4 text-blue-600 dark:text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span>{t('home.unified.feature3')}</span>
                </li>
              </ul>

              <Link to="/unified-inbox">
                <button className="inline-flex items-center justify-center w-full px-5 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  {t('home.unified.button')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </Link>
            </div>

            {/* Channel-Specific Card */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-green-100 lg:h-12 lg:w-12 dark:bg-green-900">
                <MessageSquare className="w-5 h-5 text-green-600 lg:w-6 lg:h-6 dark:text-green-300" />
              </div>
              <h3 className="mb-2 text-xl font-bold dark:text-white">{t('home.perChannel.title')}</h3>
              <p className="mb-4 text-gray-500 dark:text-gray-400">
                {t('home.perChannel.description')}
              </p>
              
              <ul className="mb-6 space-y-2 text-gray-500 dark:text-gray-400">
                <li className="flex items-center space-x-2">
                  <svg className="flex-shrink-0 w-4 h-4 text-green-600 dark:text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span>{t('home.perChannel.feature1')}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="flex-shrink-0 w-4 h-4 text-green-600 dark:text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span>{t('home.perChannel.feature2')}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="flex-shrink-0 w-4 h-4 text-green-600 dark:text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span>{t('home.perChannel.feature3')}</span>
                </li>
              </ul>

              <Link to="/channels/whatsapp">
                <button className="inline-flex items-center justify-center w-full px-5 py-3 text-base font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                  {t('home.perChannel.button')}
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
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
              {t('home.channels.title')}
            </h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 dark:bg-gray-900 dark:border-gray-700">
              <MessageSquare className="w-8 h-8 mb-2 text-green-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">{t('home.channels.whatsapp')}</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 dark:bg-gray-900 dark:border-gray-700">
              <Mail className="w-8 h-8 mb-2 text-blue-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">{t('home.channels.email')}</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 dark:bg-gray-900 dark:border-gray-700">
              <Phone className="w-8 h-8 mb-2 text-purple-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">{t('home.channels.phone')}</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 dark:bg-gray-900 dark:border-gray-700">
              <Video className="w-8 h-8 mb-2 text-red-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">{t('home.channels.video')}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
