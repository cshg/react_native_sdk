//
//  AdjustPackage.java
//  Adjust SDK Test
//
//  Created by Abdullah Obaied (@obaied) on 23rd February 2018.
//  Copyright (c) 2018 Adjust GmbH. All rights reserved.
//

package com.adjust.test;

import android.util.Log;
import java.util.List;
import java.util.ArrayList;
import com.facebook.react.bridge.*;
import com.facebook.react.modules.core.*;
import com.adjust.test.TestLibrary;

public class AdjustSdkTest extends ReactContextBaseJavaModule {
    private static final String TAG = "AdjustSdkTest";
    private TestLibrary testLibrary;
    private List<String> selectedTests = new ArrayList<String>();
    private List<String> selectedTestDirs = new ArrayList<String>();

    public AdjustSdkTest(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "AdjustSdkTest";
    }

    @ReactMethod
    public void startTestSession(String baseUrl, String sdkVersion) {
        testLibrary = new TestLibrary(baseUrl, new CommandListener(getReactApplicationContext()));
        for (int i = 0; i < selectedTests.size(); i++) {
            testLibrary.addTest(selectedTests.get(i));
        }
        for (int i = 0; i < selectedTestDirs.size(); i++) {
            testLibrary.addTestDirectory(selectedTestDirs.get(i));
        }
        testLibrary.startTestSession(sdkVersion);
    }

    @ReactMethod
    public void addInfoToSend(String key, String value) {
        if (testLibrary != null) {
            testLibrary.addInfoToSend(key, value);
        }
    }

    @ReactMethod
    public void sendInfoToServer(String basePath) {
        if (testLibrary != null) {
            testLibrary.sendInfoToServer(basePath);
        }
    }

    @ReactMethod
    public void addTest(String test) {
        this.selectedTests.add(test);
    }

    @ReactMethod
    public void addTestDirectory(String testDir) {
        this.selectedTestDirs.add(testDir);
    }
}
