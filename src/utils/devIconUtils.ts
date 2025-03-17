
/**
 * Maps technology names to their corresponding DevIcon classes
 * @param techName The technology name to map
 * @returns The DevIcon class for the technology
 */
export const getDevIconClass = (techName: string) => {
  const techLower = techName.toLowerCase();
  
  // Map technology names to DevIcon classes
  if (techLower.includes('react')) return 'devicon-react-original colored';
  if (techLower.includes('angular')) return 'devicon-angularjs-plain colored';
  if (techLower.includes('vue')) return 'devicon-vuejs-plain colored';
  if (techLower.includes('next')) return 'devicon-nextjs-original colored';
  if (techLower.includes('node')) return 'devicon-nodejs-plain colored';
  if (techLower.includes('express')) return 'devicon-express-original colored';
  if (techLower.includes('typescript') || techLower === 'ts') return 'devicon-typescript-plain colored';
  if (techLower.includes('javascript') || techLower === 'js') return 'devicon-javascript-plain colored';
  if (techLower.includes('python')) return 'devicon-python-plain colored';
  if (techLower.includes('django')) return 'devicon-django-plain colored';
  if (techLower.includes('flask')) return 'devicon-flask-original colored';
  if (techLower.includes('ruby')) return 'devicon-ruby-plain colored';
  if (techLower.includes('rails')) return 'devicon-rails-plain colored';
  if (techLower.includes('php')) return 'devicon-php-plain colored';
  if (techLower.includes('laravel')) return 'devicon-laravel-plain colored';
  if (techLower.includes('csharp') || techLower === 'c#') return 'devicon-csharp-plain colored';
  if (techLower.includes('.net') || techLower.includes('dotnet')) return 'devicon-dotnetcore-plain colored';
  if (techLower.includes('java')) return 'devicon-java-plain colored';
  if (techLower.includes('spring')) return 'devicon-spring-plain colored';
  if (techLower.includes('go')) return 'devicon-go-plain colored';
  if (techLower.includes('rust')) return 'devicon-rust-plain colored';
  if (techLower.includes('mongo')) return 'devicon-mongodb-plain colored';
  if (techLower.includes('mysql')) return 'devicon-mysql-plain colored';
  if (techLower.includes('postgres')) return 'devicon-postgresql-plain colored';
  if (techLower.includes('redis')) return 'devicon-redis-plain colored';
  if (techLower.includes('docker')) return 'devicon-docker-plain colored';
  if (techLower.includes('kubernetes') || techLower === 'k8s') return 'devicon-kubernetes-plain colored';
  if (techLower.includes('aws')) return 'devicon-amazonwebservices-original colored';
  if (techLower.includes('azure')) return 'devicon-azure-plain colored';
  if (techLower.includes('gcp') || techLower.includes('google cloud')) return 'devicon-googlecloud-plain colored';
  if (techLower.includes('firebase')) return 'devicon-firebase-plain colored';
  if (techLower.includes('tailwind')) return 'devicon-tailwindcss-plain colored';
  if (techLower.includes('bootstrap')) return 'devicon-bootstrap-plain colored';
  if (techLower.includes('sass')) return 'devicon-sass-original colored';
  if (techLower.includes('supabase')) return 'devicon-supabase-plain colored';
  if (techLower.includes('graphql')) return 'devicon-graphql-plain colored';
  
  // Default icon class for unmatched technologies
  return 'devicon-github-original'; // Using GitHub as fallback icon
};
