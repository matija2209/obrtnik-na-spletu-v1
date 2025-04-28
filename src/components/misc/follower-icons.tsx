import React from 'react';

const followerUrls = [
  'https://scontent.flju1-1.fna.fbcdn.net/v/t39.30808-1/464872296_1740470793356639_8195145041468898985_n.jpg?stp=c0.0.715.715a_cp0_dst-jpg_s64x64_tt6&_nc_cat=109&ccb=1-7&_nc_sid=e99d92&_nc_ohc=tlnV5WGUr6QQ7kNvwHXVwZ9&_nc_oc=AdnA6rMVhxmJSHg9EbFTZsA7yEKXJu2hINHWXtuRg03RmxcC5TPkTkmDMHb5OPFAjqM&_nc_zt=24&_nc_ht=scontent.flju1-1.fna&_nc_gid=bBgC7meGI1R5o77uveEbnQ&oh=00_AfGEIjAox2a5l_or-zrtKa4nJSh0jr76Pyxih3_YQo2lPA&oe=68058003',
  'https://scontent.flju1-1.fna.fbcdn.net/v/t39.30808-1/470867274_1419463592772416_1515723008621276021_n.jpg?stp=cp0_dst-jpg_s64x64_tt6&_nc_cat=104&ccb=1-7&_nc_sid=111fe6&_nc_ohc=SzX1yvYXC4YQ7kNvwH5ksRl&_nc_oc=AdmeQrNKT2GyuAFirfMS-TJQfa-ckhQ154vIweu3J_Dx37gC2-N8uOJMByDfJlpaRvk&_nc_zt=24&_nc_ht=scontent.flju1-1.fna&_nc_gid=bBgC7meGI1R5o77uveEbnQ&oh=00_AfEJnO_B392jTGVVZ4ogeuEBjn69mEj5xRGJR1MuqtD6NA&oe=6805971A',
  'https://scontent.flju1-1.fna.fbcdn.net/v/t39.30808-1/468142393_122120818568569054_4165334009524484146_n.jpg?stp=cp0_dst-jpg_s64x64_tt6&_nc_cat=110&ccb=1-7&_nc_sid=e99d92&_nc_ohc=XqiynWcWQ7EQ7kNvwFLOn3v&_nc_oc=Adkhip83nw4C22foiBVewhQFS8PTBNkT4lFeh2zUA21twlfK7egHNg9uomTNioGaasA&_nc_zt=24&_nc_ht=scontent.flju1-1.fna&_nc_gid=bBgC7meGI1R5o77uveEbnQ&oh=00_AfEjFDr9i1U_B9G-NJa5F8XQ6IkI11XT35UdY_IvWjEBfA&oe=680595D7',
  'https://scontent.flju1-1.fna.fbcdn.net/v/t39.30808-1/406649279_24183373821278164_3015292303344173702_n.jpg?stp=cp0_dst-jpg_s64x64_tt6&_nc_cat=108&ccb=1-7&_nc_sid=e99d92&_nc_ohc=SeSBj3iSi3wQ7kNvwGhtg3Q&_nc_oc=Adk--2s2_mHuoowEPKaU8YcxT5lbCSe-7UoRcUI2Wh0X2KLw53DKLDMz3qs3Zp33SRw&_nc_zt=24&_nc_ht=scontent.flju1-1.fna&_nc_gid=bBgC7meGI1R5o77uveEbnQ&oh=00_AfH2GyNJ2tFGDhC8FA7PhPZ4td6K-rrV9CH_mZmr-I1mPQ&oe=6805867A',
  'https://scontent.flju1-1.fna.fbcdn.net/v/t39.30808-1/487180593_122120133302769640_8985603480104783232_n.jpg?stp=cp0_dst-jpg_s64x64_tt6&_nc_cat=108&ccb=1-7&_nc_sid=e99d92&_nc_ohc=qFqwFSqa7cUQ7kNvwE0sl92&_nc_oc=AdkQfQX-oMLCG5RYCNZy_cflN8qqn90ZIk_-Y-vBtxz2mpYjFpzcFaE5u_kBfLqncXc&_nc_zt=24&_nc_ht=scontent.flju1-1.fna&_nc_gid=bBgC7meGI1R5o77uveEbnQ&oh=00_AfEfqmxOdfsRe0xasChVLT1ot566n9YgLmsLp-Xw_j2NOw&oe=68059B47',
  'https://scontent.flju1-1.fna.fbcdn.net/v/t39.30808-1/481773992_122098761440790262_296151466124608759_n.jpg?stp=cp0_dst-jpg_s64x64_tt6&_nc_cat=102&ccb=1-7&_nc_sid=e99d92&_nc_ohc=zdGladvbU2QQ7kNvwHj-TKI&_nc_oc=AdkRsPatQIXf_fH79ziYIwFTPJ54ONB8x6CMk5UCH8oQQ8SL-Feqs8YdBvm1vUx1dlY&_nc_zt=24&_nc_ht=scontent.flju1-1.fna&_nc_gid=bBgC7meGI1R5o77uveEbnQ&oh=00_AfHcbubdICc6JlvVL-CgLc8JBxV5ItUA_VLVKPngp21scA&oe=68059059',
  'https://scontent.flju1-1.fna.fbcdn.net/v/t39.30808-1/473332750_122093070626753383_329713294186867132_n.jpg?stp=cp0_dst-jpg_s64x64_tt6&_nc_cat=104&ccb=1-7&_nc_sid=1d2534&_nc_ohc=NrGpjQ67LRkQ7kNvwH3KB6c&_nc_oc=AdkQ-AsXcN0Rs5F7ntsWsyTnCf08h4pclCKoZpjy0bbHXSEppeMHt9ti_HYxn2sQPmQ&_nc_zt=24&_nc_ht=scontent.flju1-1.fna&_nc_gid=bBgC7meGI1R5o77uveEbnQ&oh=00_AfEJUrnBW3n28Bp59wvpoi0fkZ95hlKFkp8glpyRvNXiCA&oe=6805854F',
  'https://scontent.flju1-1.fna.fbcdn.net/v/t39.30808-1/482270659_122111976134782421_5403059544865478123_n.jpg?stp=c0.0.768.768a_cp0_dst-jpg_s64x64_tt6&_nc_cat=104&ccb=1-7&_nc_sid=111fe6&_nc_ohc=iMj5eNbRvSQQ7kNvwG0Aify&_nc_oc=Adn2LWebsM-2BL6pQUfftZRAfR7SmMovhA6fZy-8HDXTPEhXxERffwAiPS9yo7QASNc&_nc_zt=24&_nc_ht=scontent.flju1-1.fna&_nc_gid=bBgC7meGI1R5o77uveEbnQ&oh=00_AfG0sfbhJBySRbI0zlpB9LU5gqI5RPdhcAuXLMLe4ESe6A&oe=680599E8'
];

// interface FollowerIconsProps {
//   urls: string[];
// }

// const FollowerIcons: React.FC<FollowerIconsProps> = ({ urls }) => {
const FollowerIcons: React.FC = () => { // Remove props
  return (
    <div className="flex mt-2 -space-x-2">
      {/* Use internal array */}
      {followerUrls.map((url, index) => (
        <img 
          key={index} 
          src={url} 
          alt={`Sledilec ${index + 1}`} 
          className="w-8 h-8 rounded-full border-2 border-white transition-transform duration-200 ease-in-out hover:scale-125"
        />
      ))}
    </div>
  );
};

export default FollowerIcons; 