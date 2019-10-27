import React, { Component } from 'react';
import './Footer.css';

export default class Footer extends Component {
  render() {
    return (
        <div className="footer-bottom">
          <div className="footer-bottom-main">
            <ul className="social-icons">
              <li className="social-icon"><a href="#twitter" rel="noopener noreferrer"
                                             target="_blank" title="Twitter">
                <div className="svg-icon-component" data-icon-size="DEFAULT">
                  <svg viewBox="0 0 48 48">
                    <g className="gray-fill">
                      <path d="M40.9331436,11.1940288 C42.810084,10.0689342 44.2513785,8.28745345 44.9301304,6.16481389 C43.1737706,7.20644208 41.2282743,7.96298797 39.1576594,8.37075777 C37.4993523,6.6040254 35.1368481,5.5 32.5223241,5.5 C27.501861,5.5 23.4316182,9.57008073 23.4316182,14.5902197 C23.4316182,15.3026824 23.5121673,15.9965069 23.6671068,16.661807 C16.1120205,16.2827237 9.4138018,12.6636857 4.93027879,7.16397957 C4.1478016,8.50657299 3.69951412,10.0681239 3.69951412,11.7340483 C3.69951412,14.8877815 5.30449997,17.6702107 7.74366355,19.3003175 C6.25342374,19.253155 4.85183659,18.8442507 3.62609611,18.1633918 C3.62544783,18.2013163 3.62544783,18.2394029 3.62544783,18.2776516 C3.62544783,22.6820841 6.75892216,26.3562262 10.9174935,27.1912143 C10.1546268,27.3989889 9.35156666,27.5100073 8.52241311,27.5100073 C7.93668971,27.5100073 7.36717338,27.4531205 6.81224341,27.3469642 C7.96894178,30.958547 11.3260736,33.586685 15.3039361,33.660103 C12.1928276,36.0981321 8.27314842,37.5514198 4.01425536,37.5514198 C3.28056144,37.5514198 2.5569159,37.5084711 1.8457498,37.4245184 C5.86866797,40.0037111 10.6469975,41.5085373 15.780586,41.5085373 C32.5010928,41.5085373 41.6444717,27.6568433 41.6444717,15.6443274 C41.6444717,15.2501715 41.6357199,14.8581225 41.6182163,14.4683426 C43.3941867,13.1866877 44.9354788,11.5855916 46.1542502,9.76262068 C44.5239813,10.4856179 42.7719974,10.974261 40.9331436,11.1940288 Z" />
                    </g>
                  </svg>
                </div>
              </a></li>
              <li className="social-icon"><a href="https://instagram.com/madebygoogle" rel="noopener noreferrer"
                                             target="_blank" title="INSTAGRAM">
                <div className="svg-icon-component" data-icon-size="DEFAULT">
                  <svg viewBox="0 0 48 48">
                    <g className="gray-fill">
                      <path
                          d="M23.9,7.1c5.5,0,6.1,0,8.3,0.1c2,0.1,3.1,0.4,3.8,0.7c0.9,0.3,1.7,0.9,2.4,1.5c0.7,0.7,1.2,1.5,1.5,2.4 c0.3,0.7,0.6,1.8,0.7,3.8c0.1,2.2,0.1,2.8,0.1,8.3s0,6.1-0.1,8.3c-0.1,2-0.4,3.1-0.7,3.8c-0.7,1.8-2.1,3.2-3.9,3.9 c-0.7,0.3-1.8,0.6-3.8,0.7c-2.2,0.1-2.8,0.1-8.3,0.1s-6.1,0-8.3-0.1c-2-0.1-3.1-0.4-3.8-0.7c-0.9-0.3-1.7-0.9-2.4-1.5 c-0.7-0.7-1.2-1.5-1.5-2.4c-0.3-0.7-0.6-1.8-0.7-3.8c-0.1-2.2-0.1-2.8-0.1-8.3s0-6.1,0.1-8.3c0.1-2,0.4-3.1,0.7-3.8 c0.3-0.9,0.9-1.7,1.5-2.4c0.7-0.7,1.5-1.2,2.4-1.5c0.7-0.3,1.8-0.6,3.8-0.7C17.8,7.1,18.5,7.1,23.9,7.1 M23.9,3.4 c-5.6,0-6.3,0-8.5,0.1c-2.2,0.1-3.7,0.4-5,1C9.1,5,7.9,5.8,6.9,6.8c-1,1-1.9,2.3-2.4,3.6c-0.5,1.3-0.9,2.8-1,5 c-0.1,2.2-0.1,2.9-0.1,8.5s0,6.3,0.1,8.5c0.1,2.2,0.4,3.7,1,5C5,38.7,5.8,40,6.9,41c1,1,2.3,1.9,3.6,2.4c1.3,0.5,2.8,0.9,5,1 c2.2,0.1,2.9,0.1,8.5,0.1s6.3,0,8.5-0.1c2.2-0.1,3.7-0.4,5-1c2.8-1.1,4.9-3.2,6-6c0.5-1.3,0.9-2.8,1-5c0.1-2.2,0.1-2.9,0.1-8.5 s0-6.3-0.1-8.5c-0.1-2.2-0.4-3.7-1-5c-0.5-1.4-1.3-2.6-2.4-3.6c-1-1-2.3-1.9-3.6-2.4c-1.3-0.5-2.8-0.9-5-1 C30.2,3.4,29.5,3.4,23.9,3.4L23.9,3.4L23.9,3.4z" />
                      <path
                          d="M23.9,13.4c-5.8,0-10.5,4.7-10.5,10.5s4.7,10.5,10.5,10.5s10.5-4.7,10.5-10.5l0,0C34.5,18.1,29.8,13.4,23.9,13.4z M23.9,30.8c-3.8,0-6.8-3.1-6.8-6.8c0-3.8,3.1-6.8,6.8-6.8c3.8,0,6.8,3.1,6.8,6.8C30.8,27.7,27.7,30.8,23.9,30.8z" />
                      <circle cx="34.9" cy="13" r="2.5" />
                    </g>
                  </svg>
                </div>
              </a></li>
              <li className="social-icon"><a href="https://facebook.com/madebygoogle" rel="noopener noreferrer"
                                             target="_blank"
                                             title="Facebook">
                <div className="svg-icon-component" data-icon-size="DEFAULT" svg-icon="">
                  <svg viewBox="0 0 18 18">
                    <g className="gray-fill">
                      <path
                          d="M15.7,1.5H2.3c-0.5,0-0.8,0.4-0.8,0.8v13.3c0,0.5,0.4,0.8,0.8,0.8h7.2v-5.8h-2V8.4h2V6.8c0-1.9,1.2-3,2.9-3 c0.8,0,1.5,0.1,1.7,0.1v2l-1.2,0c-0.9,0-1.1,0.4-1.1,1.1v1.4h2.2l-0.3,2.3h-1.9v5.8h3.8c0.5,0,0.8-0.4,0.8-0.8V2.3 C16.5,1.9,16.1,1.5,15.7,1.5z" />
                    </g>
                  </svg>
                </div>
              </a></li>
              <li className="social-icon"><a href="#youtube" rel="noopener noreferrer" target="_blank" title="YOUTUBE">
                <div className="svg-icon-component" data-icon-size="DEFAULT" svg-icon="">
                  <svg viewBox="0 0 48 48">
                    <g className="gray-fill">
                      <path
                          d="M47.48 13.21s-.46-3.3-1.9-4.74c-1.82-1.92-3.86-1.92-4.8-2.04C34.08 5.94 24 6 24 6s-10.04-.06-16.74.42c-.92.12-2.96.12-4.78 2.04C1.04 9.9.56 13.2.56 13.2S.08 17.09 0 20.96v4.05c.08 3.88.56 7.75.56 7.75s.48 3.3 1.92 4.76c1.82 1.9 4.2 1.84 5.28 2.04 3.76.36 15.82.44 16.24.44 0 0 10.1.02 16.8-.46.92-.12 2.96-.12 4.78-2.04 1.44-1.44 1.92-4.74 1.92-4.74s.48-3.88.5-7.75v-4.05c-.04-3.87-.52-7.75-.52-7.75zM19.14 30V15.98L32 23.26 19.14 30z" />
                      <path d="M0 0h47.99v48H0z" fill="none" />
                    </g>
                  </svg>
                </div>
              </a></li>
            </ul>
            <ul className="bottom-items">
              <li className="footer-item"><a href="/regionpicker">
                <div className="footer-logo region-flag" region-flags="">
                  <div className="region-flag us-flag" />
                </div>
                <span className="country-name footer-logo-item-text">United States</span></a></li>
              <li className="footer-item"><a className="id-no-nav" rel="noopener noreferrer"
                                             href="https://policies.google.com/privacy"
                                             target="_blank">Privacy</a></li>
              <li className="footer-item"><a href="/magazine/google_nest_privacy">Commitment to
                Privacy</a></li>
              <li className="footer-item"><a className="id-no-nav"
                                             rel="noopener noreferrer"
                                             href="https://store.google.com/intl/en-US_us/about/device-terms.html"
                                             target="_blank">Sales Terms</a></li>
              <li className="footer-item"><a className="id-no-nav"
                                             rel="noopener noreferrer"
                                             href="http://www.google.com/intl/en-US_us/policies/terms/"
                                             target="_blank">Terms of Service</a></li>
              <li className="footer-item"><a className="id-no-nav"
                                             rel="noopener noreferrer"
                                             href="https://careers.google.com/hardware/?&amp;src=Online/Direct/MadebyGoogle"
                                             target="_blank">Careers</a></li>
            </ul>
          </div>
        </div>
    )
  }
}
