/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...index]]/page.tsx` route
 */

import {visionTool} from '@sanity/vision';
import {StudioNavbar, defineConfig} from 'sanity';
import {structureTool} from 'sanity/structure';
import {Iframe} from 'sanity-plugin-iframe-pane';
import {deskTool, type DefaultDocumentNodeResolver} from 'sanity/desk';

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './sanity/env';
import {schema} from './sanity/schema';
import {myTheme} from './theme';

interface SanityDocumentProps {
  slug?: {
    current?: string;
  };
}

function getPreviewUrl(doc: SanityDocumentProps) {
  return doc?.slug?.current
    ? `http://localhost:3000/blog/${doc.slug?.current}`
    : window.location.host;
}

const defaultDocumentNode: DefaultDocumentNodeResolver = (S, {schemaType}) => {
  // Only show preview pane on `movie` schema type documents
  switch (schemaType) {
    case `post`:
      return S.document().views([
        S.view.form(),
        S.view
          .component(Iframe)
          .options({
            url: (doc: SanityDocumentProps) => getPreviewUrl(doc),
          })
          .title('Preview'),
      ]);
    default:
      return S.document().views([S.view.form()]);
  }
};

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schema' folder
  schema,
  plugins: [
    // structureTool(),
    // Vision is a tool that lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({defaultApiVersion: apiVersion}),
    deskTool({
      defaultDocumentNode,
    }),
  ],
  theme: myTheme,
  studio: {
    components: {
      logo: () => '👋',
      navbar: StudioNavbar,
    },
  },
});
