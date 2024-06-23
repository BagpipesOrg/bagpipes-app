import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import ThemeContext from '../../../contexts/ThemeContext';
import './CommunityPage.scss';
import { communities } from '../data/communitiesData';
import { creators } from '../data/creatorsData';
import { Community, Creator } from '../types';

const communityRecord: Record<string, Community> = communities.reduce((acc, community) => {
  acc[community.name] = community;
  return acc;
}, {} as Record<string, Community>);

const creatorRecord: Record<string, Creator> = creators.reduce((acc, creator) => {
  acc[creator.id] = creator;
  return acc;
}, {} as Record<string, Creator>);

const CommunityPage = () => {
  const { theme } = useContext(ThemeContext);
  const { communityName } = useParams<{ communityName: string }>();
  const community = communityRecord[communityName];
  const [featuresVisible, setFeaturesVisible] = useState(true);

  console.log("CommunityPage", communityName, community);

  if (!community) {
    return <div className={`${theme} community-page`}>Community not found</div>;
  }

  return (
    <div className={`${theme} community-page`}>
      <header className="community-header">
        <img src={community.logo} alt={community.name} className="community-logo-large" />
        <div>
          <h1>{community.title}</h1>
          <p>{community.description}</p>
          <div className="hashtags">
            {community.hashTags.map((tag, index) => (
              <span key={index} className="hashtag">#{tag}</span>
            ))}
          </div>
        </div>
      </header>
      <main className="community-main">
        <section className="community-section">
          <h2>Templates</h2>
          <div className="template-container">
            <div className="template-group">
              <h3>Bagpipes Templates</h3>
              <div className="template-flex">
                {community.templates.bagpipes.map((template, index) => (
                  <div key={index} className="template-box box">
                    <strong>{template.title}</strong>
                    <p>{template.description}</p>
                    {template.workflowOrderedList && (
                      <div>
                        <h4>Workflow:</h4>
                        <ol>
                          {template.workflowOrderedList.map((step, i) => (
                            <li key={i}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    )}
                    {template.links && (
                      <div>
                        <h4>Links:</h4>
                        <ul>
                          {template.links.map((link, i) => (
                            <li key={i}><a href={link.url} target="_blank" rel="noopener noreferrer">{link.title}</a></li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="template-group">
              <h3>UI Templates</h3>
              <div className="template-flex">
                {community.templates.ui.map((template, index) => (
                  <div key={index} className="template-box box">
                    <strong>{template.title}</strong>
                    <p>{template.description}</p>
                    {template.image && (
                      <div>
                        <img src={template.image} alt={template.title} className="ui-template-image" />
                      </div>
                    )}
                    {template.links && (
                      <div>
                        <h4>Links:</h4>
                        <ul>
                          {template.links.map((link, i) => (
                            <li key={i}><a href={link.url} target="_blank" rel="noopener noreferrer">{link.title}</a></li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="community-section">
          <h2>How To</h2>
          {community.howTos.map((howTo, index) => (
            <div key={index} className="howto-box box">
              <h3>{howTo.title}</h3>
              <img src={howTo.image} alt={howTo.title} className="howto-image" />
              <p>{howTo.description}</p>
            </div>
          ))}
        </section>
        <section className="community-section">
          <h2 onClick={() => setFeaturesVisible(!featuresVisible)} className="collapsible-header">
            Features {featuresVisible ? '▲' : '▼'}
          </h2>
          {featuresVisible && (
            <div className="features-grid">
              {community.features.map((feature, index) => (
                <div key={index} className="feature-box box">
                  <h3>{feature.feature}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <aside className="community-aside">
        <h2>Most Active Creators</h2>
        <ul className="creators-list">
          {community.mostActiveCreators.map((creatorId, index) => {
            const creator = creatorRecord[creatorId];
            return (
              <li key={index} className="creator-box box">
                <img src={creator.image} alt={creator.name} className="creator-image" />
                <div>
                  <h3>{creator.name} ({creator.username})</h3>
                  <h4>{creator.title}</h4>
                  <p>{creator.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
};

export default CommunityPage;