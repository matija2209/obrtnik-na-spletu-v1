import React from 'react';
import { ContainedSection } from '@/components/layout/container-section';
import SectionHeading from '@/components/layout/section-heading';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-blue-800/80 rounded-lg p-8 text-center flex flex-col items-center">
      <div className="mb-6 h-16 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl md:text-2xl font-bold mb-4 text-white">{title}</h3>
      <p className="text-white/90 text-base md:text-lg">{description}</p>
    </div>
  );
};

interface WhyChooseUsSectionProps {
  ctaHref?: string;
}

const WhyChooseUsSection: React.FC<WhyChooseUsSectionProps> = ({
  ctaHref = '/#contact',
}) => {
  return (
    <ContainedSection
      id="zakaj-izbrati-nas"
      bgColor="bg-blue-900"
      backgroundImage='/gallery/diamantno-vrtanje-steno.jpeg'
      overlayClassName="bg-secondary/90"
      style={{
        backgroundSize: 'cover',
      }}
      verticalPadding="2xl"
    >
      <SectionHeading className="mb-16">
        <SectionHeading.Title className="text-white">
          Zakaj Izbrati Nas
        </SectionHeading.Title>
      </SectionHeading>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <FeatureCard
          icon={
            <svg width="41" height="56" viewBox="0 0 41 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.33595 54V39.626C11.947 41.8386 16.1009 43.0066 20.3359 43C24.7339 43 28.8419 41.766 32.3359 39.626V54C32.3362 54.3542 32.2425 54.702 32.0642 55.0081C31.886 55.3141 31.6297 55.5674 31.3215 55.7419C31.0134 55.9164 30.6644 56.006 30.3102 56.0015C29.9561 55.9969 29.6095 55.8984 29.3059 55.716L20.3359 50.332L11.3659 55.716C11.0624 55.8984 10.7158 55.9969 10.3617 56.0015C10.0075 56.006 9.65853 55.9164 9.35036 55.7419C9.04218 55.5674 8.78588 55.3141 8.60765 55.0081C8.42943 54.702 8.33566 54.3542 8.33595 54ZM20.3359 40C24.6643 40.0058 28.8768 38.6016 32.3359 36C34.821 34.1381 36.8379 31.7227 38.2266 28.9453C39.6153 26.168 40.3375 23.1052 40.3359 20C40.3359 8.954 31.3819 0 20.3359 0C9.28995 0 0.335948 8.954 0.335948 20C0.332835 23.1054 1.05437 26.1688 2.44317 28.9464C3.83197 31.724 5.84972 34.1392 8.33595 36C11.7951 38.6016 16.0076 40.0058 20.3359 40ZM23.6879 15.86L29.6939 16.728C30.3079 16.816 30.5539 17.572 30.1079 18.008L25.7659 22.238L26.7919 28.218C26.815 28.3557 26.7991 28.4971 26.7462 28.6263C26.6932 28.7555 26.6052 28.8673 26.4922 28.9492C26.3791 29.0311 26.2454 29.0798 26.1061 29.0898C25.9669 29.0999 25.8276 29.0708 25.7039 29.006L20.3359 26.18L14.9679 29.006C14.8441 29.071 14.7046 29.1001 14.5651 29.09C14.4257 29.0799 14.2918 29.031 14.1786 28.9489C14.0655 28.8667 13.9775 28.7545 13.9248 28.625C13.872 28.4955 13.8565 28.3539 13.8799 28.216L14.9119 22.236L10.5639 18.006C10.4641 17.9084 10.3936 17.7848 10.3602 17.6493C10.3267 17.5137 10.3318 17.3715 10.3749 17.2387C10.4179 17.1059 10.4971 16.9877 10.6037 16.8975C10.7102 16.8072 10.8399 16.7486 10.9779 16.728L16.9839 15.86L19.6639 10.42C19.726 10.2948 19.8218 10.1894 19.9405 10.1157C20.0593 10.0421 20.1962 10.003 20.3359 10.003C20.4757 10.003 20.6126 10.0421 20.7314 10.1157C20.8501 10.1894 20.9459 10.2948 21.0079 10.42L23.6879 15.86Z" fill="white"/>
            </svg>
          }
          title="Bogate Izkušnje"
          description="Z vami sta mojstra z 22 in 27 leti delovnih izkušenj na področju rezanja in vrtanja betona."
        />

        <FeatureCard
          icon={
            <svg width="80" height="48" viewBox="0 0 80 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M40.425 2.65L28.325 12.45C26.3125 14.075 25.925 17 27.45 19.0875C29.0625 21.3125 32.2 21.75 34.3625 20.0625L46.775 10.4125C47.65 9.7375 48.9 9.8875 49.5875 10.7625C50.275 11.6375 50.1125 12.8875 49.2375 13.575L46.625 15.6L68.775 36H74C77.3125 36 80 33.3125 80 30V14C80 10.6875 77.3125 8 74 8H63.9125L63.425 7.6875L54.35 1.875C52.4375 0.65 50.2 0 47.925 0C45.2 0 42.55 0.9375 40.425 2.65ZM43.275 18.2L36.8125 23.225C32.875 26.3 27.1625 25.5 24.2125 21.45C21.4375 17.6375 22.1375 12.3125 25.8 9.35L36.2 0.9375C34.75 0.325 33.1875 0.0124998 31.6 0.0124998C29.25 -1.90921e-07 26.9625 0.7 25 2L16 8H6C2.6875 8 0 10.6875 0 14V30C0 33.3125 2.6875 36 6 36H19.525L30.95 46.425C33.4 48.6625 37.1875 48.4875 39.425 46.0375C40.1125 45.275 40.575 44.3875 40.8125 43.4625L42.9375 45.4125C45.375 47.65 49.175 47.4875 51.4125 45.05C51.975 44.4375 52.3875 43.725 52.65 42.9875C55.075 44.6125 58.375 44.275 60.4125 42.05C62.65 39.6125 62.4875 35.8125 60.05 33.575L43.275 18.2Z" fill="white"/>
            </svg>
          }
          title="Zanesljivost in Neposreden Kontakt"
          description="Držimo se dogovorov in rokov. Za povpraševanje in izvedbo komunicirate neposredno z nami - brez posrednikov in nepotrebnih stroškov."
        />

        <FeatureCard
          icon={
            <svg width="65" height="64" viewBox="0 0 65 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_5502_19678)">
                <path d="M29.8281 27.377H35.517V36.6214H29.8281V27.377Z" fill="white"/>
                <path d="M38.0043 37.3329C38.0043 37.8044 37.817 38.2566 37.4836 38.59C37.1502 38.9234 36.6981 39.1107 36.2266 39.1107H29.1155C28.644 39.1107 28.1918 38.9234 27.8584 38.59C27.525 38.2566 27.3377 37.8044 27.3377 37.3329V33.7773H4.22656V49.7773C4.22656 50.7203 4.60116 51.6247 5.26796 52.2915C5.93476 52.9583 6.83913 53.3329 7.78212 53.3329H57.5599C58.5029 53.3329 59.4073 52.9583 60.0741 52.2915C60.7409 51.6247 61.1155 50.7203 61.1155 49.7773V33.7773H38.0043V37.3329Z" fill="white"/>
                <path d="M60.5999 22.0091L53.3288 14.738C52.9977 14.4096 52.5508 14.2244 52.0844 14.2224H43.1955V10.7558C43.2196 9.82164 42.875 8.91558 42.2362 8.23356C41.5974 7.55154 40.7159 7.14839 39.7822 7.11133H25.2755C24.8192 7.12928 24.3712 7.23861 23.9579 7.43283C23.5446 7.62705 23.1745 7.90222 22.8695 8.24205C22.5645 8.58187 22.3308 8.97945 22.1822 9.41122C22.0336 9.843 21.9731 10.3002 22.0044 10.7558V14.2224H13.2577C13.0237 14.2211 12.7918 14.2659 12.5752 14.3544C12.3586 14.4429 12.1616 14.5732 11.9955 14.738L4.74215 22.0091C4.57738 22.1752 4.44702 22.3722 4.35855 22.5888C4.27008 22.8054 4.22524 23.0374 4.22659 23.2713V30.2224H27.3377V26.6669C27.3377 26.1954 27.525 25.7432 27.8584 25.4098C28.1918 25.0764 28.644 24.8891 29.1155 24.8891H36.2266C36.6981 24.8891 37.1503 25.0764 37.4837 25.4098C37.8171 25.7432 38.0044 26.1954 38.0044 26.6669V30.2224H61.1155V23.2536C61.1135 22.7872 60.9284 22.3402 60.5999 22.0091ZM39.7822 14.2224H25.5599V10.6669H39.7822V14.2224Z" fill="white"/>
              </g>
              <defs>
                <clipPath id="clip0_5502_19678">
                  <rect width="64" height="64" fill="white" transform="translate(0.671875)"/>
                </clipPath>
              </defs>
            </svg>
          }
          title="Natančnost in Kvalitetna Oprema"
          description="Zagotavljamo natančno in čisto izvedbo del z uporabo profesionalne opreme."
        />
      </div>
      
      <div className="flex justify-center">
        <Button 
          size="lg"
          className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-6 text-lg"
          asChild
        >
          <Link href={ctaHref}>Pokličite nas</Link>
        </Button>
      </div>
    </ContainedSection>
  );
};

export default WhyChooseUsSection; 