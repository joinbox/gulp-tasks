// React component/JSX
const content = 'test';
const linkWithContent = () => <a>{ content }</a>;

function deco(target, key, descriptor) {
    return descriptor;
}

// Test stage 2 features for MobX
class MobXTest {
    // Decorator and class property
    @deco test = 5;
}