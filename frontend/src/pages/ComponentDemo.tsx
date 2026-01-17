import { useState } from 'react';
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Badge,
  TabList,
  Tabs,
  TabItem,
  TabPanel,
  ErrorMessage,
  LoadingOverlay,
} from '@/components/ui';

/**
 * Component Demo Page
 * Showcases all UI components with interactive examples
 */
export function ComponentDemo() {
  const [showLoading, setShowLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (inputError) setInputError('');
  };

  const handleValidate = () => {
    if (!inputValue) {
      setInputError('This field is required');
    } else if (inputValue.length < 3) {
      setInputError('Minimum 3 characters required');
    }
  };

  const handleShowLoading = () => {
    setShowLoading(true);
    setTimeout(() => setShowLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      {showLoading && <LoadingOverlay message="Loading components..." />}

      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-4xl font-bold text-slate-900">UI Components Library</h1>
          <p className="mt-2 text-slate-600">YouTube-inspired design system with React 19</p>
        </header>

        {/* Buttons Section */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-slate-900">Buttons</h2>
            <p className="mt-1 text-sm text-slate-600">
              Three variants (primary, secondary, ghost) with loading states
            </p>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-sm font-medium text-slate-700">Sizes</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary" size="sm">
                    Small
                  </Button>
                  <Button variant="primary" size="md">
                    Medium
                  </Button>
                  <Button variant="primary" size="lg">
                    Large
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-medium text-slate-700">Variants</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-medium text-slate-700">States</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary" isLoading>
                    Loading...
                  </Button>
                  <Button variant="primary" disabled>
                    Disabled
                  </Button>
                  <Button variant="secondary" onClick={handleShowLoading}>
                    Test Loading Overlay
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-medium text-slate-700">With Icons</h3>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="primary"
                    leftIcon={
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    }
                  >
                    Add Item
                  </Button>
                  <Button
                    variant="secondary"
                    rightIcon={
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Input Section */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-slate-900">Inputs</h2>
            <p className="mt-1 text-sm text-slate-600">
              Form inputs with labels, validation, and icon support
            </p>
          </CardHeader>
          <CardBody>
            <div className="grid gap-6 md:grid-cols-2">
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                helperText="We'll never share your email with anyone else."
              />
              <Input label="Password" type="password" placeholder="Enter password" />
              <Input
                label="Validation Test"
                value={inputValue}
                onChange={handleInputChange}
                error={inputError}
                placeholder="Type at least 3 characters"
                onBlur={handleValidate}
              />
              <Input
                label="Search"
                placeholder="Search..."
                prefixIcon={
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                }
              />
            </div>
          </CardBody>
        </Card>

        {/* Badges Section */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-slate-900">Badges</h2>
            <p className="mt-1 text-sm text-slate-600">Status indicators and labels</p>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-sm font-medium text-slate-700">Sizes</h3>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="default" size="sm">
                    Small
                  </Badge>
                  <Badge variant="default" size="md">
                    Medium
                  </Badge>
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-medium text-slate-700">Variants</h3>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="error">Error</Badge>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Tabs Section */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-slate-900">Tabs</h2>
            <p className="mt-1 text-sm text-slate-600">Tab navigation with keyboard support</p>
          </CardHeader>
          <CardBody>
            <TabList defaultValue="overview">
              <Tabs>
                <TabItem value="overview">Overview</TabItem>
                <TabItem value="analytics">Analytics</TabItem>
                <TabItem value="settings">Settings</TabItem>
                <TabItem value="documentation">Documentation</TabItem>
              </Tabs>
              <TabPanel value="overview">
                <div className="space-y-2">
                  <h3 className="font-semibold text-slate-900">Overview Tab</h3>
                  <p className="text-slate-600">
                    This is the overview tab content. All components follow the YouTube-inspired
                    design system with primary red color (#FF0000).
                  </p>
                </div>
              </TabPanel>
              <TabPanel value="analytics">
                <div className="space-y-2">
                  <h3 className="font-semibold text-slate-900">Analytics Tab</h3>
                  <p className="text-slate-600">
                    Analytics data and metrics will be displayed here. The tab component supports
                    keyboard navigation (Tab, Arrow keys).
                  </p>
                </div>
              </TabPanel>
              <TabPanel value="settings">
                <div className="space-y-2">
                  <h3 className="font-semibold text-slate-900">Settings Tab</h3>
                  <p className="text-slate-600">
                    Settings configuration goes here. Each tab panel is only rendered when active
                    for optimal performance.
                  </p>
                </div>
              </TabPanel>
              <TabPanel value="documentation">
                <div className="space-y-2">
                  <h3 className="font-semibold text-slate-900">Documentation Tab</h3>
                  <p className="text-slate-600">
                    Component documentation and usage examples. All components are fully typed with
                    TypeScript and support forwardRef.
                  </p>
                </div>
              </TabPanel>
            </TabList>
          </CardBody>
        </Card>

        {/* Error Message Section */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-slate-900">Error Messages</h2>
            <p className="mt-1 text-sm text-slate-600">
              Error states with optional retry action
            </p>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <ErrorMessage message="Something went wrong. Please try again." />
              <ErrorMessage
                title="Network Error"
                message="Failed to fetch data from the server. Check your internet connection."
                onRetry={() => alert('Retrying...')}
              />
              <ErrorMessage
                title="Validation Failed"
                message="Please fill in all required fields."
                showIcon={false}
              />
            </div>
          </CardBody>
        </Card>

        {/* Card Composition */}
        <Card className="hover:shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Card with Footer</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Demonstrating composition pattern
                </p>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-slate-600">
              This card demonstrates the composition pattern with Header, Body, and Footer
              components. Each sub-component can be used independently or together for maximum
              flexibility.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Fully accessible with ARIA attributes
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                TypeScript type definitions included
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Responsive design with mobile-first approach
              </li>
            </ul>
          </CardBody>
          <CardFooter>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm">
                Cancel
              </Button>
              <Button variant="primary" size="sm">
                Save Changes
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default ComponentDemo;
