import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      const activeElement = document.activeElement;
      const isTyping = activeElement?.tagName === 'INPUT' || 
                      activeElement?.tagName === 'TEXTAREA' ||
                      activeElement?.getAttribute('contenteditable') === 'true';
      
      // Cmd/Ctrl + K: Focus global search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>('input[placeholder*="Zoek"]');
        searchInput?.focus();
        return;
      }
      
      // Only allow single-key shortcuts when not typing
      if (isTyping) return;

      // Ignore if any modifier key is pressed (for copy/paste/etc.)
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      // I: Navigate to inbox
      if (e.key === 'i') {
        navigate('/unified-inbox');
      }
      
      // C: Navigate to clients
      if (e.key === 'c') {
        navigate('/');
      }
      
      // T: Navigate to tasks
      if (e.key === 't') {
        navigate('/taken');
      }
      
      // A: Navigate to assignments
      if (e.key === 'a') {
        navigate('/opdrachten');
      }
      
      // ?: Show keyboard shortcuts help (future implementation)
      if (e.key === '?') {
        console.log('Keyboard shortcuts:');
        console.log('Cmd/Ctrl + K: Focus search');
        console.log('I: Inbox');
        console.log('C: Clients');
        console.log('T: Tasks');
        console.log('A: Assignments');
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate]);
}
