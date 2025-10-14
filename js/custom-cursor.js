document.addEventListener('DOMContentLoaded', () => {
    // Create cursor elements
    const cursorContainer = document.createElement('div');
    cursorContainer.className = 'custom-cursor';
    
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    
    const cursorOutline = document.createElement('div');
    cursorOutline.className = 'cursor-outline';
    
    cursorContainer.appendChild(cursorDot);
    cursorContainer.appendChild(cursorOutline);
    document.body.appendChild(cursorContainer);
    
    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;
    
    // Update cursor position with smooth follow effect
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Update dot position immediately
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });
    
    // Smooth animation for outline
    function animateOutline() {
        // Calculate the distance between current outline position and mouse position
        let dx = mouseX - outlineX;
        let dy = mouseY - outlineY;
        
        // Update outline position with easing
        outlineX += dx * 0.2;
        outlineY += dy * 0.2;
        
        cursorOutline.style.left = outlineX + 'px';
        cursorOutline.style.top = outlineY + 'px';
        
        requestAnimationFrame(animateOutline);
    }
    
    animateOutline();
    
    // Add hover effect on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [role="button"], input[type="submit"], .swiper-button-next, .swiper-button-prev, .clickable');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursorContainer.classList.add('cursor-hover');
        });
        
        element.addEventListener('mouseleave', () => {
            cursorContainer.classList.remove('cursor-hover');
        });
    });
    
    // Add click effect
    document.addEventListener('mousedown', () => {
        cursorContainer.classList.add('cursor-hover');
    });
    
    document.addEventListener('mouseup', () => {
        cursorContainer.classList.remove('cursor-hover');
    });
});