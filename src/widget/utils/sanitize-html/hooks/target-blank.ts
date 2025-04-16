import DOMPurify from 'dompurify';

// Set all elements owning target to target="_blank"
// https://github.com/cure53/DOMPurify/issues/317#issuecomment-728100494
DOMPurify.addHook('afterSanitizeAttributes', node => {
  if ('target' in node) {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener');
  }
});
