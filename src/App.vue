<!--
  index.html — Main entry point
  Copyright (C) 2025 ANTmmmmm <ANTmmmmm@outlook.com>

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
-->

<template>
  <n-config-provider :theme-overrides="themeOverrides" :locale="naiveLocale">
    <n-dialog-provider>
      <n-message-provider>
        <router-view />
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  NConfigProvider, NDialogProvider, NMessageProvider,
  zhCN, enUS,
} from 'naive-ui'

const { locale } = useI18n()

const saved = localStorage.getItem('fursee_lang')
if (saved === 'en' || saved === 'zh') locale.value = saved

const naiveLocale = computed(() => locale.value === 'zh' ? zhCN : enUS)

const themeOverrides = {
  common: {
    primaryColor: '#333333', primaryColorHover: '#555555', primaryColorPressed: '#222222', primaryColorSuppl: '#444444',
    baseColor: '#ffffff', textColor1: '#1a1a1a', textColor2: '#555555', textColor3: '#999999',
    borderColor: '#e0e0e0', dividerColor: '#eeeeee', bodyColor: '#f5f5f5', cardColor: '#ffffff',
    hoverColor: '#f0f0f0', modalColor: '#ffffff', popoverColor: '#ffffff', tableColor: '#ffffff',
    inputColor: '#fafafa', actionColor: '#f8f8f8', successColor: '#52c41a', warningColor: '#faad14',
    errorColor: '#f5222d', infoColor: '#555555', borderRadius: '6px', fontSize: '14px',
    fontSizeSmall: '12px', fontSizeMedium: '14px', fontSizeLarge: '16px', heightMedium: '36px',
  },
  Card: { color: '#ffffff', borderColor: '#e8e8e8', borderRadius: '8px', paddingMedium: '20px' },
  Button: {
    color: '#333333', colorHover: '#555555', colorPressed: '#222222',
    textColor: '#ffffff', textColorHover: '#ffffff', textColorPressed: '#ffffff',
    border: '1px solid #333333', borderHover: '1px solid #555555', borderPressed: '1px solid #222222', borderRadius: '6px',
  },
  Menu: {
    itemColorActive: '#f0f0f0', itemTextColorActive: '#1a1a1a', itemColorActiveHover: '#e8e8e8',
    itemTextColor: '#555555', borderColor: '#e8e8e8', arrowColor: '#999999',
  },
  Tag: { color: '#f0f0f0', textColor: '#555555', border: '1px solid #e0e0e0', borderRadius: '4px' },
  Progress: { railColor: '#e8e8e8', color: '#333333', fontSize: '12px', borderRadius: '4px', railHeight: '8px' },
  Tabs: {
    tabTextColor: '#999999', tabTextColorActive: '#1a1a1a', tabTextColorHover: '#555555',
    tabBarColor: '#333333', tabColor: '#f5f5f5', tabBorderColor: '#e8e8e8',
  },
  Empty: { textColor: '#999999', iconColor: '#cccccc' },
  Input: {
    border: '1px solid #d9d9d9', borderHover: '1px solid #555555', borderFocus: '1px solid #333333',
    borderRadius: '6px', color: '#fafafa', colorFocus: '#ffffff',
  },
  Slider: {
    railColor: '#e0e0e0', railColorHover: '#cccccc', fillColor: '#333333', fillColorHover: '#555555',
    handleColor: '#333333', handleColorHover: '#555555', dotColor: '#333333',
  },
  Switch: { railColor: '#d9d9d9', railColorActive: '#333333', buttonColor: '#ffffff' },
  Table: {
    thColor: '#fafafa', tdColor: '#ffffff', borderColor: '#e8e8e8',
    thTextColor: '#1a1a1a', tdTextColor: '#333333', borderRadius: '6px',
  },
}
</script>
