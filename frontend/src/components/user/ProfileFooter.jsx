// components/ProfileFooter/ProfileFooter.jsx
import React from 'react';
import './ProfileFooter.scss';

const ProfileFooter = () => {
  const footerData = [
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#' },
        { label: 'Jobs', href: '#' },
        { label: 'For the Record', href: '#' }
      ]
    },
    {
      title: 'Communities',
      links: [
        { label: 'For Artists', href: '#' },
        { label: 'Developers', href: '#' },
        { label: 'Advertising', href: '#' },
        { label: 'Investors', href: '#' },
        { label: 'Vendors', href: '#' }
      ]
    },
    {
      title: 'Useful links',
      links: [
        { label: 'Support', href: '#' },
        { label: 'Free Mobile App', href: '#' }
      ]
    },
    {
      title: 'Spotify Plans',
      links: [
        { label: 'Premium Individual', href: '#' },
        { label: 'Premium Student', href: '#' },
        { label: 'Spotify Free', href: '#' }
      ]
    }
  ];

  return (
    <footer className="profile-footer">
      {footerData.map((section, index) => (
        <div key={index} className="profile-footer-container">
          <h4 className="title">{section.title}</h4>

          <ul>
            {section.links.map((link, linkIndex) => (
              <li key={linkIndex}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
          
        </div>
      ))}
    </footer>
  );
};

export default ProfileFooter;