/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import NexusSerpentDemo from './components/NexusSerpentDemo';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  return (
    <div className="w-full h-screen overflow-hidden bg-black">
      <ErrorBoundary>
        <NexusSerpentDemo />
      </ErrorBoundary>
    </div>
  );
}

