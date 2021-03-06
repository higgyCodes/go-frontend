'use strict';

export const whitelistDomains = [
  'ifrc.org',
  'apdisasterresilience.org',
  'arabrcrc.org',
  'arcs.org.af',
  'bdrcs.org',
  'cck-cr.cz',
  'ckcg.me',
  'climatecentre.org',
  'creuroja.ad',
  'cri.it',
  'croix-rouge.fr',
  'croix-rouge.lu',
  'croix-rouge.mc',
  'croixrouge.ht',
  'croixrougesenegal.com',
  'crucearosie.ro',
  'cruzroja.cl',
  'cruzroja.es',
  'cruzroja.gt',
  'cruzroja.or.cr',
  'cruzroja.org',
  'cruzroja.org.ar',
  'cruzroja.org.hn',
  'cruzroja.org.pa',
  'cruzroja.org.pe',
  'cruzroja.org.py',
  'cruzrojaboliviana.org',
  'cruzrojacolombiana.org',
  'cruzrojamexicana.org.mx',
  'cruzrojanicaraguense.org',
  'cruzrojasal.org.sv',
  'cruzrojauruguaya.org',
  'cruzrojavenezolana.org',
  'cruzvermelha.org.br',
  'cruzvermelha.pt',
  'drk.de',
  'drk.dk',
  'egyptianrc.org',
  'fijiredcross.org',
  'grsproadsafety.org',
  'guatemala.cruzroja.org',
  'hck.hr',
  'honduras.cruzroja.org',
  'icrc.org',
  'indianredcross.org',
  'jamaicaredcross.org',
  'jnrcs.org',
  'jrc.or.jp',
  'kenyaredcross.org',
  'kizilay.org.tr',
  'krcs.org.kw',
  'laoredcross.org.la',
  'livelihoodscentre.org',
  'mauritiusredcross.com',
  'mdais.org',
  'nrcs.org',
  'palestinercs.org',
  'pck.org.pl',
  'pmi.or.id',
  'prcs.org.pk',
  'pscentre.org',
  'qrcs.org.qa',
  'rcs.ir',
  'rcsbahrain.org',
  'rcuae.ae',
  'redcrescent.az',
  'redcrescent.kz',
  'redcrescent.org.mv',
  'redcrescent.org.my',
  'redcrescent.tj',
  'redcrescent.uz',
  'redcross-eu.net',
  'redcross.am',
  'redcross.be',
  'redcross.bg',
  'redcross.by',
  'redcross.ca',
  'redcross.ch',
  'redcross.ee',
  'redcross.fi',
  'redcross.ge',
  'redcross.gr',
  'redcross.ie',
  'redcross.int',
  'redcross.is',
  'redcross.lk',
  'redcross.lt',
  'redcross.lv',
  'redcross.md',
  'redcross.mn',
  'redcross.no',
  'redcross.or.ke',
  'redcross.or.kr',
  'redcross.or.th',
  'redcross.org',
  'redcross.org.au',
  'redcross.org.cn',
  'redcross.org.cy',
  'redcross.org.hk',
  'redcross.org.jm',
  'redcross.org.kh',
  'redcross.org.lb',
  'redcross.org.mm',
  'redcross.org.mo',
  'redcross.org.mt',
  'redcross.org.mz',
  'redcross.org.na',
  'redcross.org.nz',
  'redcross.org.ph',
  'redcross.org.rs',
  'redcross.org.sg',
  'redcross.org.ua',
  'redcross.org.uk',
  'redcross.org.vn',
  'redcross.org.za',
  'redcross.ru',
  'redcross.se',
  'redcross.sk',
  'redcross.tl',
  'redcrosseth.org',
  'redcrossmuseum.ch',
  'redcrossug.org',
  'redcrosszim.org.zw',
  'rks.si',
  'rodekors.dk',
  'rodekruis.nl',
  'roteskreuz.at',
  'roteskreuz.li',
  'sarc.sy',
  'sierraleoneredcross.org',
  'srcs.sd',
  'standcom.ch',
  'voroskereszt.hu'
];

export default {
  properties: {
    email: {
      type: 'string',
      format: 'email'
    },
    username: {
      type: 'string'
    },
    firstname: {
      type: 'string'
    },
    lastname: {
      type: 'string'
    },
    country: {
      type: 'string'
    },
    city: {
      type: 'string'
    },
    organizationType: {
      type: 'string'
    },
    organization: {
      type: 'string'
    },
    department: {
      type: 'string'
    },
    position: {
      type: 'string'
    },
    password: {
      type: 'string',
      minLength: 8
    },
    passwordConf: {
      const: { '$data': '1/password' }
    }
  },
  required: [
    'email',
    'username',
    'organizationType',
    'organization',
    'firstname',
    'lastname',
    'country',
    'password',
    'passwordConf'
  ],
  if: {
    properties: {
      email: {
        not: {
          pattern: whitelistDomains.map(o => `@${o}`).join('|')
        }
      }
    }
  },
  then: {
    properties: {
      contact: {
        type: 'array',
        items: {
          properties: {
            name: {
              type: 'string'
            },
            email: {
              type: 'string',
              format: 'email'
            }
          },
          required: ['name', 'email']
        }
      }
    }
  }
};
