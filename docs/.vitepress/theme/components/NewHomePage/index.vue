<script setup lang="ts">
import HeroSection from './HeroSection.vue'
import PlatformStats from './PlatformStats.vue'
import ArchSection from './ArchSection.vue'
import CapSection from './CapSection.vue'
import CoreFeaturesSection from './CoreFeaturesSection.vue'
import ProductCLI from './ProductCLI.vue'
import ProductSkill from './ProductSkill.vue'
import ProductMCP from './ProductMCP.vue'
import ProductOpenAPI from './ProductOpenAPI.vue'
import GetStarted from './GetStarted.vue'
// import MarketCoverage from './MarketCoverage.vue'
</script>

<template>
  <div class="new-home-page">
    <HeroSection />
    <PlatformStats />
    <ArchSection />
    <CoreFeaturesSection />
    <ProductCLI />
    <ProductSkill />
    <ProductMCP />
    <CapSection />
    <ProductOpenAPI />
    <GetStarted />
    <!-- <MarketCoverage /> -->
  </div>
</template>

<style scoped>
.new-home-page {
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
}
</style>
