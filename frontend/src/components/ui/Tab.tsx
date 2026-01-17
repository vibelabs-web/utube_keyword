import { createContext, useContext, useState } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface TabContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabContext = createContext<TabContextValue | undefined>(undefined);

const useTabContext = () => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error('Tab components must be used within a TabList');
  }
  return context;
};

interface TabListProps extends HTMLAttributes<HTMLDivElement> {
  defaultValue: string;
  children: React.ReactNode;
}

/**
 * Tab component with composition pattern
 *
 * Usage:
 * <TabList defaultValue="tab1">
 *   <TabList.Tabs>
 *     <TabItem value="tab1">Tab 1</TabItem>
 *     <TabItem value="tab2">Tab 2</TabItem>
 *   </TabList.Tabs>
 *   <TabPanel value="tab1">Content 1</TabPanel>
 *   <TabPanel value="tab2">Content 2</TabPanel>
 * </TabList>
 */
export const TabList = ({ defaultValue, children, className, ...props }: TabListProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn('w-full', className)} {...props}>
        {children}
      </div>
    </TabContext.Provider>
  );
};

interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * Tabs container - wraps TabItem components
 */
export const Tabs = ({ children, className, ...props }: TabsProps) => {
  return (
    <div
      className={cn('flex border-b border-slate-200', className)}
      role="tablist"
      {...props}
    >
      {children}
    </div>
  );
};

interface TabItemProps extends HTMLAttributes<HTMLButtonElement> {
  value: string;
  children: React.ReactNode;
}

/**
 * Individual tab button
 */
export const TabItem = ({ value, children, className, ...props }: TabItemProps) => {
  const { activeTab, setActiveTab } = useTabContext();
  const isActive = activeTab === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${value}`}
      id={`tab-${value}`}
      className={cn(
        'relative px-4 py-3 text-sm font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        'hover:text-primary',
        isActive
          ? 'text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary'
          : 'text-slate-600'
      )}
      onClick={() => setActiveTab(value)}
      {...props}
    >
      {children}
    </button>
  );
};

interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

/**
 * Tab panel - content associated with a tab
 */
export const TabPanel = ({ value, children, className, ...props }: TabPanelProps) => {
  const { activeTab } = useTabContext();

  if (activeTab !== value) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      id={`panel-${value}`}
      aria-labelledby={`tab-${value}`}
      className={cn('py-4', className)}
      {...props}
    >
      {children}
    </div>
  );
};

// Attach sub-components to TabList
const TabNamespace = Object.assign(TabList, {
  Tabs,
  Item: TabItem,
  Panel: TabPanel,
});

export default TabNamespace;
