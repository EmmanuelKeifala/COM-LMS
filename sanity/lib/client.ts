import {createClient} from 'next-sanity';
import {
  apiVersion,
  dataset,
  projectId,
  useCdn,
  sanityToken,
  isPreviewMode,
} from '../env';

export const client = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn,
  perspective: isPreviewMode ? 'previewDrafts' : 'published',
  // token: isPreviewMode ? sanityToken : undefined,
  ignoreBrowserTokenWarning: isPreviewMode ? true : false,
});
